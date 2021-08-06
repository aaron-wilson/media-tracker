import React from 'react';

class NoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.defaultValue };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event, mediaListId, mediaId) {
    const myRequest = new Request(`${process.env.REACT_APP_BASE_URL}/medias/lists/${mediaListId}/medias/${mediaId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media_note: this.state.value,
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
        this.props.handleCloseClick();
      })
      .catch((error) => console.error('Internal Server', error));
  }

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Add a note"
          value={this.state.value}
          onChange={this.handleChange}
          className="form-control note-text"
        />
        <button className="btn btn-primary note-button update-note-button pointer" onClick={(e) => this.handleSubmit(e, this.props.mediaListId, this.props.mediaId)}>Update</button>
      </div>
    );
  }
}

export default NoteForm;
