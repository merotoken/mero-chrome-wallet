import moment from 'moment';

class Utilities {
	formatTime = (timestamp) => {
		return moment.unix(timestamp).fromNow();
	}

  getTimestamp = (datetime) => {
     return moment.utc(datetime).unix();
  }

  format = (number, decimals = 5) => {
		number = Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
		const parts = number.toString().split(".");

		return parts.join(".");
  }
}

const utils = new Utilities();
export default utils;
