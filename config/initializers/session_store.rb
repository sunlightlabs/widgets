# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key    => '_widget-frontend_session',
  :secret => '2a899a4e8df793857d39fdef57ba5a326beab423bdb72713a4f2f93e01c8b068f810c491165c3e8ca385d57cf37c201c967a596b3949eb15fe45f56e56e1e36e'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
