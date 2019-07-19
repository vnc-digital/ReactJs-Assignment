import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      image: "",
      photosList: [""]
    };
  }

  componentDidMount() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: "649422225571419",
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: "v3.2" // The Graph API version to use for the call
      });
    };

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  login = () => {
    window.FB.login(
      response => {
        this.statusChangeCallback(response);
        // handle the response
      },
      { scope: "public_profile,email,user_photos" }
    );
  };

  testfunction = () => {
    this.userphotos();
  };

  statusChangeCallback(response) {
    console.log("statusChangeCallback");
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === "connected") {
      var accessToken = response.authResponse.accessToken;
      localStorage.setItem("token", accessToken);
      this.testAPI();
      console.log(accessToken);
      // Logged into your app and Facebook.
    } else {
      // The person is not logged into your app or we are unable to tell.
      //   document.getElementById("status").innerHTML =
      //     "Please log " + "into this app.";
    }
  }
  testAPI() {
    console.log("Welcome!  Fetching your information.... ");
    window.FB.api(
      "/me",
      {
        fields: "email,name,id,first_name,last_name,picture"
      },
      function(response) {
        console.log(response);
        console.log("Successful login for: " + response.name);
        console.log("Successful login for: " + response.id);
        console.log("Successful login for: " + response.picture.data.url);
        localStorage.setItem("user", response.name);
        localStorage.setItem("image", response.picture.data.url);
        this.setState({
          user: response.name,
          image: response.picture.data.url
        });
      }.bind(this)
    );
  }

  userphotos() {
    const token = localStorage.getItem("token");

    window.FB.api(
      "/me/albums",
      {
        access_token: token
      },
      function(response) {
        this.setState({
          albumList: response.data
        });

        this.albumPhotos(token);
      }.bind(this)
    );
  }

  albumPhotos(token) {
    if (!this.state.albumList) return;
    for (let i = 0; i < this.state.albumList.length; i++) {
      window.FB.api(
        "/" + this.state.albumList[i].id + "/picture?redirect=false",
        {
          access_token: token
        },
        function(response) {
          const newAlbumList = this.state.albumList;
          newAlbumList[i].pictureUrl = response.data.url;
          this.setState({ albumList: newAlbumList });
        }.bind(this)
      );
    }
  }

  albumid() {
    const token = localStorage.getItem("token");
    window.FB.api("/me", {
      access_token: token,
      fields: "email,name,id,first_name,last_name,picture"
    });
  }
  logout = () => {
    window.FB.logout();

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("image");
    window.location.reload();
  };
  test = () => {
    this.getphotoid();
  };
  getphotoid() {
    const token = localStorage.getItem("token");
    if (!this.state.albumList) return;
    for (let i = 0; i < this.state.albumList.length; i++) {
      window.FB.api(
        "/" + this.state.albumList[i].id + "/photos",
        {
          access_token: token
        },
        function(response) {
          this.setState({ photolist: response.data });
          console.log("photoid" + JSON.stringify(this.state.photolist));
          this.particularphotos(token);
        }.bind(this)
      );
    }
  }
  particularphotos(token) {
    if (!this.state.photolist) return;
    for (let i = 0; i < this.state.photolist.length; i++) {
      window.FB.api(
        "/" + this.state.photolist[i].id + "?fields=images",
        {
          access_token: token
        },
        function(response) {
          // var newphotos = this.state.photolist;
          // newphotos[i].url = response.images[i].source.filter(
          //   res => res.width > 400
          // );
          // this.setState({ photolist: newphotos });
          // console.log("photos" + JSON.stringify(this.state.photolist));
        }.bind(this)
      );
    }
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-3">
            <button onClick={this.login} className="btn btn-primary">
              Facebook login
            </button>
          </div>
          <div className="col-md-3">
            <button onClick={this.testfunction} className="btn btn-primary">
              albums
            </button>
          </div>
          <div className="col-md-3">
            <button onClick={this.logout} className="btn btn-primary">
              logout
            </button>
          </div>
          {/* <div className="col-md-3">
            <button onClick={this.albumid} className="btn btn-primary">
              photos
            </button>
          </div> */}
        </div>
        <div>
          <h6>{localStorage.getItem("user")}</h6>&nbsp;
          <img src={localStorage.getItem("image")} width={50} />
        </div>{" "}
        &nbsp; &nbsp;
        <div>
          <h6>{this.state.albumList ? this.state.albumList[0].name : ""}</h6>
          <img
            src={this.state.albumList ? this.state.albumList[0].pictureUrl : ""}
            onClick={this.test}
          />
        </div>
        <div>
          <h6>{this.state.albumList ? this.state.albumList[1].name : ""}</h6>
          <img
            src={this.state.albumList ? this.state.albumList[1].pictureUrl : ""}
          />
        </div>
        <div>
          <h6>{this.state.albumList ? this.state.albumList[2].name : ""}</h6>
          <img
            src={this.state.albumList ? this.state.albumList[2].pictureUrl : ""}
          />
        </div>
        <div>
          <h6>{this.state.albumList ? this.state.albumList[3].name : ""}</h6>
          <img
            src={this.state.albumList ? this.state.albumList[3].pictureUrl : ""}
          />
        </div>
        <div>{JSON.stringify(this.state.albumList)}</div>
      </div>
    );
  }
}
export default Login;
