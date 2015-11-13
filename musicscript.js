
var MainDiv = React.createClass({
  getInitialState: function(){
      return {songData: []};
  },
  //ajax call from itunes api and setting the results to the data to songData
  loadMusic: function(music){
    $.ajax({
      url: 'https://itunes.apple.com/search',
      method: 'GET',
      data: {term: music},
      dataType: 'jsonp',
      success: function(musicResult, status, xhr){
        this.setState({songData: musicResult.results})
      }.bind(this),
      error: function(xhr, status, error){
        console.log('error', error);
      }
    })
  },
  //loading initial search for taylor swift
  componentDidMount: function(){
    this.loadMusic('taylor swift');
  },
  //bootstrap render of songData
  render: function(){
    return(
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <Nav/>
            <NavForm musicTitle={this.loadMusic}/>
            <div className="navbar-left">
              <ul className="nav navbar-nav">
                <li><a href="./movieSearch.html">Movie/Show Search </a></li>
                <li className="active"><a href="./musicSearch.html">Music/Artist Search</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='container'>
          <PageHeader />
          <SearchResultList songs={this.state.songData}/>
        </div>
      </div>
    )
  }
});

//Nav Website Title/Brand
var Nav = React.createClass({
  render: function(){
    return (
        <div className="navbar-header">
          <a className="navbar-brand" href="./index.html">
            <h4>Searchster</h4>
          </a>
        </div>
    )
  }
});

//Nav Search Form
var NavForm = React.createClass({
  handleSubmit: function(event){
    event.preventDefault();
    var songTitle = React.findDOMNode(this.refs.musicTitle).value;
    if (!songTitle){
      return;
    }
    this.props.musicTitle(songTitle)
    return;
  },
  render: function(){
    return (
        <form className="navbar-form navbar-right" role="search" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input type="text" className="form-control input-sm" ref='musicTitle' placeholder="Search Music/Artists"/>
          </div>
          <button type="submit" className="btn btn-default">Search</button>
        </form>
    )
  }
});

//page header for music search
var PageHeader = React.createClass({
  render: function(){
    return (
      <div class="page-header">
        <h1><small>What Music/Artists would you like to know about?</small></h1>
      </div>
    )
  }
});

//Shows the list of results
var SearchResultList = React.createClass({
  render: function(){
    var theSong = this.props.songs.map(function(music){
      return (
        <IndividualMusicResult artists={music}/>
      )
    });
    return (
      <div className='panel-group'>
          {theSong}
      </div>
    )
  }
});

//listing of music information
var IndividualMusicResult = React.createClass({
  render: function(){
    return(
      <div className='panel-heading'>
      <a className="btn btn-info" role="button" data-toggle="collapse" href={"#collapse"+this.props.artists.trackId}>
         {this.props.artists.trackName} <small><small> / {this.props.artists.artistName}</small></small>
      </a>
      <div className="collapse" id={"collapse"+this.props.artists.trackId}>
        <div className="well">
            <div className='container'>
              <div className='col-md-3'>
                <img src={this.props.artists.artworkUrl100}/>
              </div>
              <div className='col-md-6'>
                <p><strong>Album: </strong>{this.props.artists.collectionName}</p>
                <p><strong>Released On: </strong>{moment(this.props.artists.releaseDate).format('LL')}</p>
                <a href={this.props.artists.previewUrl}><p>Listen to song</p></a>
                <a href={this.props.artists.artistViewUrl}><p>Learn more about {this.props.artists.artistName}</p></a>
                <a href={this.props.artists.collectionViewUrl}><p>Check out other songs from the album</p></a>
              </div>
            </div>
        </div>
      </div>
      </div>
    )
  }
});

React.render(< MainDiv />, document.body);
