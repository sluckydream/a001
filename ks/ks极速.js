const fs = require("fs");
const path = require("path");
const axios = require("axios");

const VERSION = 20251223;
const UPDATE_INFO_URL = "https://raw.githubusercontent.com/sluckydream/ks001/main/update/version.json";

const CURRENT_FILE = __filename;
const TEMP_FILE = CURRENT_FILE + ".new";

async function checkUpdate() {
  try {
    const { data } = await axios.get(UPDATE_INFO_URL, {
      timeout: 5000
    });

    if (!data || !data.version || !data.url) {
      console.log("更新信息格式错误");
      return;
    }

    if (data.version > VERSION) {
      console.log(`发现新版本 ${data.version}，开始更新...`);

      const res = await axios.get(data.url, {
        responseType: "arraybuffer",
        timeout: 10000
      });

      fs.writeFileSync(TEMP_FILE, res.data);
      fs.copyFileSync(TEMP_FILE, CURRENT_FILE);
      fs.unlinkSync(TEMP_FILE);

      console.log("更新完成，请重启程序");
      process.exit(0);
    } else {
      console.log("当前已是最新版本");
    }
  } catch (err) {
    console.error("检查更新失败：", err.message);
  }
}

// 启动即检查
checkUpdate();

// ===== 正常业务逻辑 =====
console.log("程序运行中，当前版本：", VERSION);
