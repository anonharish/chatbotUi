import { useRef, useState } from "react";

type Props = {
  name: string;
  photo: string;
  verified?: boolean;
  roleLabel?: string;
  showEdit?: boolean;
  onEditProfile?: () => void;
};

export const HeaderSection = ({
  name,
  photo,
  verified,
  roleLabel = "Agent",
  showEdit = false,
  onEditProfile,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(
    photo || "/src/assets/agents/default.png"
  );
  const [hovered, setHovered] = useState(false);

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <>
      <style>{`

        .profile-header {
          position: relative;
        }

        .cover-img {
          width: 100%;
          object-fit: cover;
          border-radius: 20px 20px 0 0;
          display: block;
          height: 160px;
        }

        .profile-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.9);
          border-radius: 0 0 20px 20px;
          padding: 12px 20px 12px 20px;
          position: relative;
        }

        .profile-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        /* ── Profile pic absolutely placed over banner/info seam ── */
        .profile-pic-absolute {
          position: absolute;
          left: 20px;
          bottom: 10px;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          overflow: hidden;
          border: 5px solid white;
          background: #e5e7eb;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 20;
        }

        .profile-pic {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .profile-edit-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
          pointer-events: none;
          z-index: 2;
        }

        /* spacer pushes text right to clear the pic */
        .profile-pic-spacer {
          width: 100px;
          flex-shrink: 0;
        }

        .profile-text h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .profile-text p {
          margin: 0;
          color: #6d6d6d;
          font-size: 13px;
        }

        .profile-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .verified-icon { width: 36px; }
        .qr-icon { width: 32px; }

        .edit-profile-btn {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .edit-profile-btn:hover {
          background: rgba(0,0,0,0.08);
        }

        /* ── lg (1024px) ── */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .cover-img { height: 185px; border-radius: 16px 16px 0 0; }
          .profile-info { padding: 14px 24px 14px 24px; border-radius: 0 0 16px 16px; }
          .profile-left { gap: 16px; }
          .profile-pic-absolute { width: 110px; height: 110px; left: 24px; bottom: 12px; border-width: 6px; }
          .profile-pic-spacer { width: 126px; }
          .profile-text h2 { font-size: 17px; }
          .profile-text p { font-size: 13px; }
          .profile-right { gap: 12px; }
          .verified-icon { width: 42px; }
          .qr-icon { width: 36px; }
        }

        /* ── xl (1280px+) ── */
        @media (min-width: 1280px) {
          .cover-img { height: 220px; }
          .profile-info { padding: 16px 30px 16px 30px; }
          .profile-left { gap: 20px; }
          .profile-pic-absolute { width: 130px; height: 130px; left: 30px; bottom: 14px; border-width: 7px; }
          .profile-pic-spacer { width: 150px; }
          .profile-text h2 { font-size: 20px; }
          .profile-text p { font-size: 14px; }
          .profile-right { gap: 14px; }
          .verified-icon { width: 50px; }
          .qr-icon { width: 42px; }
        }
      `}</style>

      <div className="profile-header">

        {/* Banner */}
        <img
          src="/src/assets/agents/Bannar.png"
          className="cover-img"
          alt="Banner"
        />

        {/* Profile pic — absolutely positioned over banner/info seam */}
        <div
          className="profile-pic-absolute"
          onClick={handlePhotoClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img src={preview} className="profile-pic" alt="Profile" />
          <div
            className="profile-edit-overlay"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={handlePhotoChange}
        />

        {/* Info bar */}
        <div className="profile-info">
          <div className="profile-left">
            {/* spacer to push text past the pic */}
            <div className="profile-pic-spacer" />
            <div className="profile-text">
              <h2>{name}</h2>
              <p>{roleLabel}</p>
            </div>
          </div>

          <div className="profile-right">
            {showEdit && (
              <button
                onClick={onEditProfile}
                className="edit-profile-btn"
                aria-label="Edit profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#555"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
            {verified && (
              <img
                src="/src/assets/icons/verified.png"
                className="verified-icon"
                alt="Verified"
              />
            )}
            <img src="/src/assets/icons/qr.png" className="qr-icon" alt="QR" />
          </div>
        </div>

      </div>
    </>
  );
};