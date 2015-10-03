
var MainDiv = React.createClass({
  getInitialState: function(){
      return {movieData: []};
  },
  loadMovies: function(title){
    $.ajax({
      url: 'https://www.omdbapi.com/',
      method: 'GET',
      data: {s: title},
      success: function(movieResult, status, xhr){
        this.setState({movieData: movieResult.Search})
      }.bind(this),
      error: function(xhr, status, error){
        console.log('error', error);
      }
    })
  },
  componentDidMount: function(){
    this.loadMovies('game of thrones');
  },
  render: function(){
    return(
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <Nav/>
            <NavForm movieTitle={this.loadMovies}/>
            <div className="navbar-left">
              <ul className="nav navbar-nav">
                <li className="active"><a href="./movieSearch.html">Movie/Show Search </a></li>
                <li><a href="./musicSearch.html">Music/Artist Search</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='container'>
          <PageHeader />
          <SearchResultList movies={this.state.movieData}/>
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
    var movTitle = React.findDOMNode(this.refs.movieTitle).value;
    if (!movTitle){
      return;
    }
    this.props.movieTitle(movTitle);
    return;
  },
  render: function(){
    return (
        <form className="navbar-form navbar-right" role="search" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input type="text" className="form-control input-sm" ref='movieTitle' placeholder="Search Movie/Show"/>
          </div>
          <button type="submit" className="btn btn-default">Search</button>
        </form>
    )
  }
});

//page header for movie search
var PageHeader = React.createClass({
  render: function(){
    return (
      <div class="page-header">
        <h1><small>What Movies/Shows would you like to know about?</small></h1>
      </div>
    )
  }
});
//Shows the list of results
var SearchResultList = React.createClass({
  render: function(){
    var theMovie = this.props.movies.map(function(movie){
      return (
        <IndividualMovieResult movie={movie}/>
      )
    });
    return (
      <div className='panel-group'>
          {theMovie}
      </div>
    )
  }
});

//listing of movie movie information through second ajax call
var IndividualMovieResult = React.createClass({
  getInitialState: function(){
    return { movieResult: []};
  },
  loadMovie: function(title){
    $.ajax ({
      url: 'https://www.omdbapi.com/',
      method: 'GET',
      data: {t: title},
      success: function(imovieResult, status, xhr){
        this.setState({movieResult: imovieResult});
      }.bind(this),
      error: function(xhr, status, error){
        console.log('error', error)
      }
    })
  },
  handleClick: function(event){
    event.preventDefault();
    var indvidualMovie = React.findDOMNode(this.refs.theMovie).text;
    if (!indvidualMovie){
      return;
    }
    this.loadMovie(indvidualMovie);
    return;
  },
  render: function(){
    return(
      <div className='panel-heading'>
      <a className="btn btn-info" role="button" data-toggle="collapse" onClick={this.handleClick} ref='theMovie'href={"#collapse"+this.props.movie.imdbID}>
        {this.props.movie.Title}
      </a>
      <div className="collapse" id={"collapse"+this.props.movie.imdbID}>
        <div className="well">
          <MovieInfoDisplay result={this.state.movieResult} />
        </div>
      </div>
      </div>
    )
  }
});

//displaying individual movie info
var MovieInfoDisplay = React.createClass({
  render: function(){
    return (
      <div className='container'>
        <div className='col-md-4'>
          <img src={this.props.result.Poster}/>
        </div>
        <div className='col-md-6'>
          <h4><strong>IMDB Rating: </strong>&#9733; {this.props.result.imdbRating} / 10</h4>
          <p><strong>Year: </strong> {this.props.result.Year}</p>
          <p><strong>Released: </strong> {moment(this.props.result.Released).format('LL')}</p>
          <p><strong>Runtime: </strong> {this.props.result.Runtime}</p>
          <p><strong>Genre: </strong> {this.props.result.Genre}</p>
          <p><strong>Plot: </strong> {this.props.result.Plot}</p>
        </div>
      </div>
    )
  }
});


React.render(< MainDiv />, document.body);
