import React, { Component } from 'react';
import NoteForm from './NoteForm';

class MediaList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      modalDisplay: null,
      unseenMedias: [],
      seenMedias: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNevermindClick = this.handleNevermindClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleMediaBoxClick = this.handleMediaBoxClick.bind(this);
    this.handleMoveClick = this.handleMoveClick.bind(this);
    this.handleResultClick = this.handleResultClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleRefreshImageClick = this.handleRefreshImageClick.bind(this);
    this.dataObject = {};
  }

  componentDidMount() {
    this.initialize();
  }

  initialize() {
    const { mediaListId } = this.props.match.params;
    const url = `${process.env.REACT_APP_BASE_URL}/medias/lists/${mediaListId}/status`;

    fetch(`${url}/unseen`, {
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        const unseenMedias = data.medias.map((media) => (
          <div
            className="form-control media-box-wrapper"
            key={media.id}
            id={media.id}
            tmdb_id={media.tmdb_id}
            onClick={(e) => this.handleMediaBoxClick(media.id, media.title, 'unseen')}
          >
            <div className="media-box">
              <img src={media.tmdb_poster} alt="poster" />
              <p>{media.title}</p>
              <p>{media.rating}</p>
            </div>
            <button
              type="button"
              className="btn-close close-position-2"
              aria-label="Close"
              onClick={(e) => this.handleDeleteClick(e, media.id)}
            />
          </div>
        ));

        fetch(`${url}/seen`, {
          credentials: 'same-origin',
        })
          .then((response) => response.json())
          .then((data) => {
            const seenMedias = data.medias.map((media) => (
              <div
                className="form-control media-box-wrapper"
                key={media.id}
                id={media.id}
                tmdb_id={media.tmdb_id}
                onClick={(e) => this.handleMediaBoxClick(media.id, media.title, 'seen')}
              >
                <div className="media-box">
                  <img src={media.tmdb_poster} alt="poster" />
                  <p>{media.title}</p>
                  <p>{media.rating}</p>
                </div>
                <button
                  type="button"
                  className="btn-close close-position-2"
                  aria-label="Close"
                  onClick={(e) => this.handleDeleteClick(e, media.id)}
                />
              </div>
            ));
            this.setState((prevState, props) => ({
              value: '',
              modalDisplay: null,
              unseenMedias,
              seenMedias,
            }));
          });
      });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${this.state.value}&page=1&include_adult=false`;

    fetch(url, {
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('API Success: all results', data.results);
        // console.log('API Success: first result', data.results[0])

        const modalDisplay = data.results.slice(0, 3).map((media) => {
          this.dataObject[media.id] = media;

          return (
            <div
              className="form-control media-box-wrapper"
              key={media.id}
              id={media.id}
              onClick={(e) => this.handleResultClick(media.id)}
            >
              <div className="media-box">
                <img src={media.poster_path ? `https://image.tmdb.org/t/p/w780${media.poster_path}` : ''} alt="poster" />
                <p>{media.media_type === 'tv' ? media.name : media.title}</p>
                <p>{media.vote_average}</p>
              </div>
            </div>
          );
        });

        modalDisplay.push(<button key="hs1" className="btn btn-primary pointer" onClick={this.handleNevermindClick}>Nevermind</button>);

        this.setState((prevState, props) => ({
          value: '',
          modalDisplay,
        }));
      })
      .catch((error) => console.error('API', error));
  }

  handleNevermindClick() {
    this.setState({ modalDisplay: null }, () => { this.dataObject = {}; });
  }

  handleCloseClick() {
    this.setState({
      modalDisplay: null,
    });
  }

  handleMediaBoxClick(mediaId, mediaTitle, status) {
    const { mediaListId } = this.props.match.params;
    const url = `${process.env.REACT_APP_BASE_URL}/medias/lists/${mediaListId}/medias/${mediaId}`;
    fetch(url, {
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        const modalDisplay = [];

        const nfProps = {
          mediaListId,
          mediaId,
          defaultValue: data.row.media_note ? data.row.media_note : '',
          handleCloseClick: this.handleCloseClick,
        };
        modalDisplay.push(
          <div key="hmbc1">
            <NoteForm {...nfProps} />
          </div>,
        );

        modalDisplay.push(
          <div key="hmbc2">
            <button className="btn btn-primary note-button pointer" onClick={(e) => this.handleRefreshImageClick(mediaId, mediaTitle)}>Refresh Image</button>
          </div>,
        );

        modalDisplay.push(
          <div key="hmbc3">
            <button className="btn btn-primary note-button pointer" onClick={(e) => this.handleMoveClick(mediaId, status)}>{status === 'seen' ? 'Move to To Watch' : 'Move to Watched'}</button>
          </div>,
        );

        modalDisplay.push(
          <div key="hmbc4">
            <button className="btn btn-danger note-button close-note-button pointer" onClick={this.handleCloseClick}>Close</button>
          </div>,
        );

        this.setState({
          modalDisplay,
        });
      })
      .catch((error) => console.error('Internal Server', error));
  }

  handleMoveClick(mediaId, status) {
    const { mediaListId } = this.props.match.params;
    const myRequest = new Request(`${process.env.REACT_APP_BASE_URL}/medias/lists/${mediaListId}/medias/${mediaId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media_status: status === 'seen' ? 'unseen' : 'seen',
      }),
      credentials: 'same-origin',
    });

    fetch(myRequest)
      .then((response) => {
        const s = response.status;
        if (s === 200) return response.json();
        throw new Error(response.statusText);
      })
      .then(() => {
        this.initialize();
      })
      .catch((error) => console.error('Internal Server', error));
  }

  handleResultClick(tmdbId) {
    const media = this.dataObject[tmdbId];

    const myRequest = new Request(`${process.env.REACT_APP_BASE_URL}/medias`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media: {
          id: media.id,
          type: media.media_type,
          title: media.media_type === 'tv' ? media.name : media.title,
          vote_average: media.vote_average,
          backdrop_path: media.backdrop_path,
          poster_path: media.poster_path,
          release_date: media.media_type === 'tv' ? media.first_air_date : media.release_date,
          overview: media.overview,
        },
        media_list_id: this.props.match.params.mediaListId,
      }),
      credentials: 'same-origin',
    });

    fetch(myRequest)
      .then((response) => {
        const s = response.status;
        if (s === 200 || s === 422) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        // show the user successful response
        // whether 'db updated' or 'already exists'
        console.log('success', data);
        this.dataObject = {};
        this.initialize();
      })
      .catch((error) => console.error('Internal Server', error));
  }

  handleDeleteClick(event, mediaId) {
    event.stopPropagation();
    const { mediaListId } = this.props.match.params;
    const url = `${process.env.REACT_APP_BASE_URL}/medias/lists/${mediaListId}/medias/${mediaId}`;

    const myRequest = new Request(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    });

    fetch(myRequest)
      .then((response) => {
        const s = response.status;
        if (s === 200 || s === 422) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        // show the user successful response
        // whether 'db updated' or 'already exists'
        console.log('success', data);
        this.initialize();
      })
      .catch((error) => console.error('Internal Server', error));
  }

  handleRefreshImageClick(mediaId, mediaTitle) {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${mediaTitle}&page=1&include_adult=false`;
    // const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
    // const url = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

    fetch(url, {
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('API Success: all results', data.results)
        // console.log('API Success: first result', data.results[0])

        const foundMedia = data.results.slice(0, 3).filter((media) => {
          const mediaElements = this.state.unseenMedias.concat(this.state.seenMedias);
          const foundMediaElements = mediaElements.filter((mediaElement) => mediaElement.props.tmdb_id === media.id);
          if (foundMediaElements.length === 1) return true;
          return false;
        });
        const newPosterPath = foundMedia.length === 1 ? foundMedia[0].poster_path : '';
        return newPosterPath;
      })
      .then((newPosterPath) => {
        if (!newPosterPath) throw Error(`newPosterPath ${newPosterPath} invalid`);

        const myRequest = new Request(`${process.env.REACT_APP_BASE_URL}/medias/id/${mediaId}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            poster_path: newPosterPath,
          }),
          credentials: 'same-origin',
        });

        return fetch(myRequest);
      })
      .then((response) => {
        const s = response.status;
        if (s === 200 || s === 422) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        // show the user successful response
        // whether 'db updated' or 'already exists'
        console.log('success', data);
        this.initialize();
      })
      .catch((error) => {
        console.error('API', error);
        // TODO: close modal
      });
  }

  render() {
    return (
      <div>
        {this.state.modalDisplay
          ? (
            <div className="medialist-modal-window">
              <div className="medialist-modal">
                {this.state.modalDisplay}
              </div>
            </div>
          )
          : null}
        <div className="home-card">
          <form onSubmit={this.handleSubmit} className="form-group">
            <input
              type="text"
              placeholder="Add a movie or TV show..."
              value={this.state.value}
              onChange={this.handleChange}
              className="form-control"
            />
          </form>
          <div className="display">
            <div className="unseen">
              <h2>To Watch</h2>
              {this.state.unseenMedias}
            </div>
            <div className="seen">
              <h2>Watched</h2>
              {this.state.seenMedias}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MediaList;
