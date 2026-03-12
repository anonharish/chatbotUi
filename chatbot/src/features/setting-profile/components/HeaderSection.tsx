import { useRef, useState } from "react";

type Props = {
  name: string;
  photo: string;
  verified?: boolean;
  roleLabel?: string;
};

export const HeaderSection = ({ name, photo, verified, roleLabel = "Agent" }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string>(
    photo || "/src/assets/agents/default.png"
  );

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  return (
    <>
      <style>{`
        .profile-header {
          position: relative;
          margin-top: 65px;
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
          padding: 16px 20px;
          margin-top: -28px;
        }

        .profile-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .profile-pic-wrapper {
          position: relative;
          flex-shrink: 0;
          width: 130px;
          height: 136px;
          margin-top: -60px;
        }

        .profile-pic {
          width: 100%;
          height: 100%;
          border-radius: 100px;
          border: 6px solid white;
          background: white;
          object-fit: cover;
          display: block;
          transform: translateY(83px);
        }

        .profile-edit-overlay {
          position: absolute;
          inset: 0;
          border-radius: 100px;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          transform: translateY(70px);
        }

        .profile-pic-wrapper:hover .profile-edit-overlay {
          opacity: 1;
        }

        .profile-text h2 {
          margin: 0;
          font-size: 16px;
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

        .verified-icon {
          width: 40px;
        }

        .qr-icon {
          width: 34px;
        }

        /* ── 1024px (lg) ── */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .profile-header {
            margin-top: 50px;
          }

          .cover-img {
            height: 185px;
            border-radius: 16px 16px 0 0;
          }

          .profile-info {
            padding: 20px 24px;
            margin-top: -32px;
            border-radius: 0 0 16px 16px;
          }

          .profile-left {
            gap: 16px;
          }

          .profile-pic-wrapper {
            width: 155px;
            height: 160px;
            margin-top: -68px;
          }

          .profile-pic {
            border-width: 7px;
            transform: translateY(60px);
          }

          .profile-edit-overlay {
            transform: translateY(60px);
          }

          .profile-text h2 {
            font-size: 17px;
          }

          .profile-text p {
            font-size: 13px;
          }

          .profile-right {
            gap: 12px;
          }

          .verified-icon {
            width: 46px;
          }

          .qr-icon {
            width: 38px;
          }
        }

        /* ── 1440px (xl) ── */
        @media (min-width: 1280px) {
          .profile-header {
            margin-top: 40px;
          }

          .cover-img {
            height: 220px;
          }

          .profile-info {
            padding: 25px 30px;
            margin-top: -40px;
          }

          .profile-left {
            gap: 20px;
          }

          .profile-pic-wrapper {
            width: 197px;
            height: 200px;
            margin-top: -80px;
          }

          .profile-pic {
            border-width: 8px;
            transform: translateY(40px);
          }

          .profile-edit-overlay {
            transform: translateY(40px);
          }

          .profile-text h2 {
            font-size: 20px;
          }

          .profile-text p {
            font-size: 14px;
          }

          .profile-right {
            gap: 14px;
          }

          .verified-icon {
            width: 55px;
          }

          .qr-icon {
            width: 45px;
          }
        }
      `}</style>

      <div className="profile-header">

        {/* Banner */}
        <div className="profile-banner">
          <img src="/src/assets/agents/Bannar.png" className="cover-img" alt="Banner" />
        </div>

        {/* Info Card */}
        <div className="profile-info">

          {/* LEFT SECTION */}
          <div className="profile-left">
            <div
              className="profile-pic-wrapper cursor-pointer"
              onClick={handlePhotoClick}
            >
              <img src={preview} className="profile-pic" alt="Profile" />
              <div className="profile-edit-overlay">
                <img src="/src/assets/icons/edit.png" className="w-5 h-5" alt="Edit" />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handlePhotoChange}
            />

            <div className="profile-text">
              <h2>{name}</h2>
              <p>{roleLabel}</p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="profile-right">
            {verified && (
              <img src="/src/assets/icons/verified.png" className="verified-icon" alt="Verified" />
            )}
            <img src="/src/assets/icons/qr.png" className="qr-icon" alt="QR" />
          </div>

        </div>
      </div>
    </>
  );
};