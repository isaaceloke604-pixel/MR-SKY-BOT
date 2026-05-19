import makeWASocket, {
  useMultiFileAuthState
} from "@whiskeysockets/baileys";

import pino from "pino";

async function startBot() {

  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  const phoneNumber = "243895412475";

  if (!sock.authState.creds.registered) {

    const code =
      await sock.requestPairingCode(phoneNumber);

    console.log("================================");
    console.log("🔥 CODE WHATSAPP :", code);
    console.log("================================");
  }

  sock.ev.on("connection.update", ({ connection }) => {

    console.log("STATUS:", connection);

    if (connection === "open") {
      console.log("✅ BOT CONNECTÉ !");
    }
  });

  console.log("🚀 BOT STARTED");
}

startBot();
