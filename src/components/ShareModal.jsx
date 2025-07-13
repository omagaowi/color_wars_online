import { QRCodeSVG } from "qrcode.react";
import "../styles/gameStyles/share.css";
import { useAuthStore } from "../utils/online/authStore";
import { newAlert } from "./Alerts";
// import ResponsiveQRCode from "./QR";

const ShareModal = () => {
  const { showShare, setShowShare } = useAuthStore((state) => ({
    showShare: state.showShare,
    setShowShare: state.setShowShare,
  }));

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      throw err;
      // console.error('Failed to copy: ', err);
    }
  }

  return (
    <div className={`share-modal ${showShare ? "show" : ""} `}>
      <h3>Room ID: {window.location.href.split("/")[5]}</h3>
      <div className="scan">
       <QRCodeSVG fgColor="#4e839a" size={ 160 } value={`${window.location.href
              .split("/")
              .slice(0, -3)
              .join("/")}/joinroom?ID=${window.location.href.split("/")[5]}`} />
      </div>
      <div className="link">
        <div className="link-text">
          <p>{`${window.location.href
            .split("/")
            .slice(0, -3)
            .join("/")}/joinroom?ID=${window.location.href.split("/")[5]}`}</p>
        </div>
        <div
          className="copy"
          title="Copy Link"
          onClick={() => {
            const link = `${window.location.href
              .split("/")
              .slice(0, -3)
              .join("/")}/joinroom?ID=${window.location.href.split("/")[5]}`;
            copyToClipboard(link)
              .then((data) => {
                newAlert({
                  type: "success",
                  users: [],
                  message: `Link Copied!`,
                  color:  "green",
                });
                setShowShare(false)
              })
              .catch((error) => {
                 newAlert({
                  type: "error",
                  users: [],
                  message: `Unable to copy link!`,
                  color:  "red",
                });
              });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-clipboard"
            viewBox="0 0 16 16"
          >
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
