const moment = require("moment");
const events = require("events");

class SocketAntiSpam {
  constructor(sets) {
    this.debug("constructor", "Initializing");
    this.defaultOptions = {
      banTime: 60,
      kickThreshold: 10,
      kickTimesBeforeBan: 3,
      banning: true,
      socketIoPrefix: ""
    };

    this.users = {};
    this.options = this.defaultOptions;
    this.event = new events.EventEmitter();

    if (this.not(sets.banTime)) {
      sets.banTime = this.defaultOptions.banTime;
    }

    if (this.not(sets.kickThreshold)) {
      sets.kickThreshold = this.defaultOptions.kickThreshold;
    }

    if (this.not(sets.kickTimesBeforeBan)) {
      sets.kickTimesBeforeBan = this.defaultOptions.kickTimesBeforeBan;
    }

    if (this.not(sets.banning)) {
      sets.banning = this.defaultOptions.banning;
    }

    if (this.not(sets.socketIoPrefix)) {
      sets.socketIoPrefix = this.defaultOptions.socketIoPrefix;
    }

    if (this.not(sets.redis)) {
      sets.redis = false;
      this.debug("constructor", "Not using redis..");
    }

    if (sets.io) {
      this.debug(
        "constructor",
        "Socket-io variable given, binding to onevent's"
      );
      sets.io.on("connection", socket => {
        this.nativeSocketOnEvent = socket.onevent;
        socket.onevent = packet => {
          const args = packet.data || [];
          this.addSpam(socket)
            .then(() => {
              this.nativeSocketOnEvent.call(socket, packet);
            })
            .catch(e => {
              this.event.emit("error", new Error(e));
            });
        };

        this.authenticate(socket);
      });
    }

    this.options = sets;
    this.redis = this.options.redis;

    if (this.redis) {
      this.debug("constructor", "Using redis store..");
      this.commitHandler = setInterval(() => {
        this.redisCommit();
      }, 4000);
      this.readHandler = setInterval(() => {
        this.redisRead();
      }, 4000);
    }
    this.redisRead();
  }

  disconnect() {
    clearInterval(this.commitHandler);
    clearInterval(this.readHandler);
    this.options.io.onevent = this.nativeSocketOnEvent;
  }

  debug(place, text) {
    let printText = "";
    for (var i = 1; i < arguments.length; i++) {
      printText += arguments[i] + " ";
    }

    require("debug")(`socketantispam:${place}`)(`${printText}`);
  }

  not(val) {
    return val == null || val === false || val == undefined;
  }

  redisCommit() {
    if (!this.redis) {
      return false;
    }

    this.debug("redis", "Commiting Data");

    return new Promise((resolve, reject) => {
      this.redis.set(
        `${this.options.socketIoPrefix}-socketantispam_users`,
        JSON.stringify(this.users)
      );
      resolve();
    });
  }

  redisRead() {
    if (!this.redis) {
      return false;
    }

    this.debug("redis", "Reading Data");

    return new Promise((resolve, reject) => {
      this.redis.get(
        `${this.options.socketIoPrefix}-socketantispam_users`,
        (err, reply) => {
          if (err) {
            return reject(err);
          }
          const jsonReply = JSON.parse(reply);
          if (!jsonReply) {
            this.users = {};
          } else {
            this.users = jsonReply;
          }
          return resolve();
        }
      );
    });
  }

  authenticate(socket) {
    this.debug("authenticate", "Authenticating socket", socket.id);
    return new Promise((resolve, reject) => {
      if (this.not(socket.ip)) {
        if (socket.handshake.headers["x-forwarded-for"]) {
          socket.ip = socket.handshake.headers["x-forwarded-for"].split(",")[0];
        } else {
          socket.ip = socket.handshake.address;
        }
      }

      this.event.emit("authenticate", socket);
      if (typeof this.users[socket.ip] == "undefined") {
        this.users[socket.ip] = {
          score: 0,
          banned: false,
          kickCount: 0,
          bannedUntil: 0,
          lastInteraction: moment(),
          lastLowerKick: moment()
        };
      }

      const data = this.users[socket.ip];
      if (data.banned) {
        data.banned = false;

        if (data.bannedUntil.diff === undefined) {
          data.bannedUntil = moment(data.bannedUntil);
        }
        if (data.bannedUntil.diff(moment(), "seconds") >= 1) {
          data.banned = true;
          socket.banned = true;
          this.debug(
            "authenticate",
            "Banned socket on authentication",
            socket.id,
            "for",
            data.bannedUntil.diff(moment(), "seconds"),
            "seconds"
          );
          socket.disconnect();
        }
      }

      return resolve(data);
    });
  }

  addSpam(socket) {
    return new Promise((resolve, reject) => {
      if (this.not(socket)) {
        return reject(new Error("socket variable is not defined"));
      }
      this.debug("addspam", "Adding spamscore to", socket.id);

      this.authenticate(socket)
        .then(data => {
          if (data.banned) {
            return reject(new Error("socket is banned"));
          }

          const lastInteraction = moment
            .duration(moment().diff(data.lastInteraction))
            .asSeconds();
          data.lastInteraction = moment();

          if (lastInteraction < 1) {
            data.score++;
          }

          if (lastInteraction >= 1) {
            const newScore = data.score - Math.round(lastInteraction);
            data.score = newScore;
            if (newScore <= 0) {
              data.score = 0;
            }
          }

          const lastLowerKick = moment
            .duration(moment().diff(data.lastLowerKick))
            .asSeconds();
          if (lastLowerKick >= 1800 && data.kickCount >= 1) {
            data.lastLowerKick = moment();
            data.kickCount--;
          }

          this.event.emit("spamscore", socket, data);
          if (data.score >= this.options.kickThreshold) {
            this.event.emit("kick", socket, data);
            data.score = 0;
            data.kickCount = data.kickCount + 1;
            if (
              data.kickCount >= this.options.kickTimesBeforeBan &&
              this.options.banning
            ) {
              this.event.emit("ban", socket, data);
              data.kickCount = 0;
              data.banned = true;
              data.lastLowerKick = moment();
              data.bannedUntil = moment().add(this.options.banTime, "minutes");
            }

            socket.disconnect();
          }

          this.debug(
            "addspam",
            "Current spamscore of",
            socket.id,
            "is",
            data.score
          );
          return resolve(data);
        })
        .catch(e => {
          return reject(e);
        });
    });
  }

  ban(data, min) {
    this.debug("ban", "Banning", data, min);
    return new Promise((resolve, reject) => {
      if (this.not(data)) {
        throw new Error("No options defined");
      }

      if (this.not(min)) {
        min = this.options.banTime;
      }

      let ip = false;
      if (typeof this.users[data] != "undefined") {
        ip = data;
      }

      if (typeof this.users[data.ip] != "undefined") {
        ip = data.ip;
      }

      if (ip) {
        return this.banUser(true, ip)
          .then(resolve)
          .catch(reject);
      }

      return reject(new Error("ip is not defined"));
    });
  }

  unBan(data) {
    this.debug("unban", "Unbanning", data);
    return new Promise((resolve, reject) => {
      if (this.not(data)) {
        return reject(new Error("No options defined"));
      }

      let ip = false;
      if (typeof this.users[data] != "undefined") {
        ip = data;
      }

      if (typeof this.users[data.ip] != "undefined") {
        ip = data.ip;
      }

      if (ip) {
        return this.banUser(false, ip)
          .then(resolve)
          .catch(reject);
      }

      return reject(new Error("ip is not defined"));
    });
  }

  banUser(ban, data, min) {
    this.debug("banUser", ban, data, min);

    return new Promise((resolve, reject) => {
      this.users[data].kickCount = 0;
      this.users[data].score = 0;
      if (ban) {
        this.users[data].banned = true;
        this.users[data].lastLowerKick = moment();
        this.users[data].bannedUntil = moment().add(min, "minutes");
      } else {
        this.users[data].banned = false;
        this.users[data].lastLowerKick = moment();
        this.users[data].bannedUntil = 0;
      }

      return resolve();
    });
  }

  getBans() {
    return new Promise((resolve, reject) => {
      const banned = [];
      for (let user in this.users) {
        if (this.users[user].banned)
          banned.push({
            ip: user,
            until: this.users[user].bannedUntil
          });
      }

      return resolve(banned);
    });
  }
}

module.exports = SocketAntiSpam;