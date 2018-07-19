export default class BowerVersionGetter {
  constructor() {
    this.knownRequests = {};
  }
  async getBowerInfo(path) {
    if (this.knownRequests[path]) {
      return this.knownRequests[path];
    }
    try {
      var bowerJSON = await fetch(path).then(res => {
        if (res.status !== 200) {
          throw new Error();
        }
        return res.json();
      });
    } catch (e) {
        this.knownRequests[path] = {bowerInfo: '-'};
        return this.knownRequests[path];
    }
    const result = {};

    let bowerInfo = bowerJSON.name;
    if (bowerJSON._release) {
      bowerInfo += `@${bowerJSON._release}`; //only in .bower.json
    }
    result.bowerInfo = bowerInfo;
    if (bowerJSON.homepage) {
      //non-standard but often present
      result.packageUrl = bowerJSON.homepage;
    }
    this.knownRequests[path] = result;
    return result;
  }
}
