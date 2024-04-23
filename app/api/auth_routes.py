from flask import Blueprint, request, session, abort, redirect
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
import os
import requests
from google.oauth2 import id_token
import google_auth_oauthlib
from pip._vendor import cachecontrol
import google.auth.transport.requests
from tempfile import NamedTemporaryFile
import json

auth_routes = Blueprint('auth', __name__)
environment = os.getenv("FLASK_ENV");

############ OAUTH 2.0 SETUP #####################################################################
# Here we will configure our Flow class and also perform some other preliminary setup steps.

# We need to allow HTTP traffic for local dev
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

"""
As the flow object requires a file path to load the configuration from AND
we want to keep our credentials safe (out of our github repo!!).
We will create a temporary file to hold our values as json.
Some of these values will come from our .env file.
"""

# Import our credentials from the .env file
CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')

# The dictionary to be written out as JSON
client_secrets = {
    "web": {
    "client_id": CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": CLIENT_SECRET,
    "redirect_uris": [
    "http://localhost:8000/api/auth/callback",
    "https://aa-munch.onrender.com/api/auth/callback"
    ]}
}

"""
Below we are generating a temporary file as the google oauth package requires a file for configuration!
Note that the property '.name' is the file PATH to our temporary file!
"""
secrets = NamedTemporaryFile()

# The command below will write our dictionary to the temp file AS json!
with open(secrets.name, "w") as output:
    json.dump(client_secrets, output)

# Below we will generate a configuration class from our JSON formatted file along with a session class for the flow.
oauth2_session, client_config = google_auth_oauthlib.helpers.session_from_client_secrets_file(
    secrets.name,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
)

secrets.close() # This method call deletes our temporary file from the /tmp folder! We no longer need it as our flow object has been configured!

"""
Initializing our flow class below, note that there is a parameter named 'autogenerate_code_verifier'
which is not shown as it has a default value of True, which is preceisely what we want.
As a result, our flow class constructor will generate a code verifier for us and transmit it in
URL parameters of the first redirect in our OAuth flow.
"""
uri = "http://localhost:8000/api/auth/callback"
if(environment == 'production'):
    uri = "https://aa-munch.onrender.com/api/auth/callback"
flow = google_auth_oauthlib.flow.Flow(
    oauth2_session,
    client_type='web',
    client_config=client_config,
    redirect_uri=uri,
)

############ END OAUTH 2.0 SETUP ##########################################################################

@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            first_name=form.data['first_name'],
            last_name=form.data['last_name']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401


# Our OAuth flow initiating endpoint.

@auth_routes.route("/oauth_login")
def oauth_login():
    authorization_url, state = flow.authorization_url(prompt="select_account consent")
    # print("AUTH URL: ", authorization_url) # I recommend that you print this value out to see what it's generating.
    """
    Ex: https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=<Your Clien ID>&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fcallback&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&state=MTSa8pz4vH4Tpgl6qVaISesExrPpBE&code_challenge=bpJG7pNYuCkA-8CZ6lo-P-GbvdOeYpXTCXT6ZB2j-4o&code_challenge_method=S256&prompt=select_account+consent&access_type=offline
    It SHOULD look a lot like the URL in the SECOND or THIRD line of our flow chart!

    Note that in the auth url above the value 'access_type' is set to 'offline' by default. Without this parameter being set, we would not receive a Refresh Token with our Access Token.
    Additionally, the values we passed in to the prompt property will garauntee that we see the screen to select our google account
    regardless of wether or not we are currently logged in with Google. After which we will see the Consent Screen for our application.
    """

    # The call to authorization_url() above is generating the random 'state' value that we will use as CSRF protection for our flow.
    session["state"] = state # We will save it into flask state so that we can verify later.

    # We will also extract the Referer Header from the original request sent by our client so that we can send them back to the page they were on when they initiated authentication with Google.
    referrer = request.headers.get('Referer') # Contains the URL from which the request came.
    session["referrer"] = referrer

    return redirect(authorization_url) # This line technically will enact the SECOND and THIRD lines of our flow chart.

# The famous redirect_uri is our 2nd endpoint.

@auth_routes.route("/callback")
def callback():
    # Exchange the ephemeral 'code' returned by Google for an Access Token.
    flow.fetch_token(authorization_response=request.url) # This method is sending the request depicted on line 6 of our flow chart! The response is depicted on line 7 of our flow chart.

    # This is our CSRF protection for the Oauth Flow!
    if not session["state"] == request.args["state"]:
        abort(500)  # State does not match!

    credentials = flow.credentials # These should be the user's credentials sent back with the Access Token from the fetch_token() call above!
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session) # Here we get an HTTP transport for our id token request.

    """
    The method call below will go through the tedious work of verifying the JWT signature of the JWT sent back with the object from OpenID Connect.
    Although I cannot verify, hopefully it is also testing the values for "sub", "aud", "iat", and "exp" sent back in the CLAIMS section of the JWT
    Additionally note, that the oauth initializing URL generated in the previous endpoint DID NOT send a random nonce value. (As depicted in our flow chart)
    If it had, the server would return the nonce in the JWT claims to be used for further verification tests!

    The signature validation will require fetching the rsa key components from the google certs endpoint:
    https://www.googleapis.com/oauth2/v1/certs
    """
    id_info = id_token.verify_oauth2_token(  # Returns the decoded id_token claims if signature verification succeeds.
        id_token=credentials._id_token,
        request=token_request,
        audience=CLIENT_ID,
        clock_skew_in_seconds=5
    )

    # Now we generate a new session for the newly authenticated user!!
    # Note that depending on the way your app behaves, you may be creating a new user at this point...
    temp_email = id_info.get('email')

    user_exists = User.query.filter(User.email == temp_email).first()

    if not user_exists:
        user_exists = User(
            username=id_info.get("name"),
            email=temp_email,
            password='OAUTH',
            first_name= id_info.get("name").split(' ')[0],
            last_name= id_info.get('name').split(' ')[1]
        )

        db.session.add(user_exists)
        db.session.commit()

    login_user(user_exists)

    return redirect(session['referrer']) # This will send the final redirect to our user's browser. As depicted in Line 8 of the flow chart!
