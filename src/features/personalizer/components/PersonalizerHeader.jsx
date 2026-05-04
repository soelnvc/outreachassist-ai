/**
 * PersonalizerHeader — renders the welcome message and user auth actions for the personalizer page.
 *
 * @param {Object} props
 * @param {Object} props.currentUser - The currently authenticated user
 * @param {Object} props.userProfile - The user's profile data
 * @param {Function} props.onLoginClick - Callback for login button
 * @param {Function} props.onSignOutClick - Callback for sign out button
 * @returns {JSX.Element}
 */
export function PersonalizerHeader({
  currentUser,
  userProfile,
  onLoginClick,
  onSignOutClick
}) {
  const firstName = userProfile?.name?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'there';

  return (
    <header className="flex justify-between items-center mb-8">
      <h2 className="text-4xl font-bold font-heading tracking-tight">
        Welcome Back, <span className="bg-gradient-to-r from-[#F472B6] to-[#FDE047] bg-clip-text text-transparent">
          {firstName}
        </span>
      </h2>
      {currentUser ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-gray-600">{currentUser.email}</span>
          <button
            onClick={onSignOutClick}
            className="liquid-button bg-[#E0D0F5]/60 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-semibold font-subheading px-5 py-2 rounded-full transition-all z-0"
          >
            <span className="relative z-10">Sign Out</span>
          </button>
        </div>
      ) : (
        <button
          onClick={onLoginClick}
          className="liquid-button bg-[#E0D0F5]/60 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-semibold font-subheading px-5 py-2 rounded-full transition-all z-0"
        >
          <span className="relative z-10">Login / Sign Up</span>
        </button>
      )}
    </header>
  );
}
