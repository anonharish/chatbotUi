import { useRef, useState } from "react";

type Props = {
  name: string;
  photo: string;
  verified?: boolean;
  roleLabel?: string;
  showEdit?: boolean;
  isEditing?: boolean;
  onEditProfile?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
};

export const HeaderSection = ({
  name,
  photo,
  verified,
  roleLabel = "Agent",
  showEdit = false,
  isEditing = false,
  onEditProfile,
  onSave,
  onCancel,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(
    photo || "/src/assets/agents/default.png"
  );

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="profile-header">

      {/* Banner */}
      <img
        src="/src/assets/agents/Bannar.png"
        className="cover-img"
        alt="Banner"
      />

      {/* Profile pic with edit badge at bottom-right */}
      <div className="profile-pic-wrapper" style={{ cursor: "default" }}>
        <img src={preview} className="profile-pic" alt="Profile" />

        {/* ✅ Edit badge — bottom-right like Google profile */}
        <div
          onClick={handlePhotoClick}
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#ffffff",
            border: "2px solid #d1d5db",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 30,
            boxShadow: "0 2px 6px rgba(0,0,0,0.20)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#444"
            strokeWidth="2.5"
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
          <div className="profile-pic-spacer" />
          <div className="profile-text">
            <h2>{name}</h2>
            <p>{roleLabel}</p>
          </div>
        </div>

        <div className="profile-right">

          {/* Edit icon — shown when NOT editing */}
          {showEdit && !isEditing && (
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

          {/* Save + Cancel — shown when editing */}
          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={onCancel}
                className="
                  px-4 py-1.5 rounded-full border border-gray-400
                  text-gray-600 text-xs font-medium
                  hover:bg-gray-100 transition-colors
                "
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="
                  px-4 py-1.5 rounded-full
                  bg-blue-600 text-white text-xs font-medium
                  hover:bg-blue-700 transition-colors
                "
              >
                Save
              </button>
            </div>
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
  );
};