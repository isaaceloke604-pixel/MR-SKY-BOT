import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import pino from "pino";

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        console.log("STATUS:", connection);

        // 👉 QR va s’afficher ici proprement
        if (qr) {
            console.log("SCAN QR 👇");
            console.log(qr);
        }

        if (connection === "open") {
            console.log("🔥 BOT CONNECTÉ AVEC SUCCÈS");
        }

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            console.log("RECONNECT:", shouldReconnect);

            if (shouldReconnect) startBot();
        }
    });

    console.log("BOT STARTING...");
}

startBot();
