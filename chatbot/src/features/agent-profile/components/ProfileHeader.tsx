type Props = {
  name: string;
  photo: string;
  verified?: boolean;
};

export const ProfileHeader = ({ name, photo, verified }: Props) => {
  return (
    <div className="profile-header">

      {/* Banner */}
      <div className="profile-banner">
        <img src="/src/assets/agents/Bannar.png" className="cover-img" />
      </div>

      {/* Info Card */}
      <div className="profile-info">

        {/* Left */}
        <div className="profile-left">

          <div className="profile-pic-wrapper">
            <img src={photo} className="profile-pic" />
          </div>

          <div className="profile-text">
            <h2>{name}</h2>
            <p>Agent</p>
          </div>

        </div>

        {/* Right Icons */}
        <div className="profile-right">

          {verified && (
            <img
              src="/src/assets/icons/verified.png"
              className="verified-icon"
            />
          )}

          <img
            src="/src/assets/icons/qr.png"
            className="qr-icon"
          />

        </div>

      </div>
    </div>
  );
};
