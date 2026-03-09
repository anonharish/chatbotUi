import { useRef, useState } from "react";

type Props = {
  name: string;
  photo: string;
  verified?: boolean;
};

export const HeaderSection = ({ name, photo, verified }: Props) => {

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
    <div className="profile-header">

      {/* Banner */}
      <div className="profile-banner">
        <img
          src="/src/assets/agents/Bannar.png"
          className="cover-img"
        />
      </div>

      {/* Info Card */}
      <div className="profile-info">

        {/* LEFT SECTION */}
        <div className="profile-left">

          {/* PROFILE IMAGE */}
          <div
            className="profile-pic-wrapper relative cursor-pointer group"
            onClick={handlePhotoClick}
          >

            <img
              src={preview}
              className="profile-pic object-cover"
              alt="Profile"
            />

            {/* EDIT OVERLAY */}
            <div className="profile-edit-overlay absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition">

              <img
                src="/src/assets/icons/edit.png"
                className="w-6 h-6"
                alt="Edit"
              />

            </div>

          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            hidden
            onChange={handlePhotoChange}
          />

          {/* TEXT */}
          <div className="profile-text">
            <h2>{name}</h2>
            <p>Agent</p>
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="profile-right">

          {verified && (
            <img
              src="/src/assets/icons/verified.png"
              className="verified-icon"
              alt="Verified"
            />
          )}

          <img
            src="/src/assets/icons/qr.png"
            className="qr-icon"
            alt="QR"
          />

        </div>

      </div>

    </div>
  );
};