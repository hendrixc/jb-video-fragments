/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  size, cloneDeep, head, remove, findIndex, isNull, isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import MyContext from './MyContext';

const fullVideoClip = {
  id: 1,
  name: 'Full Video',
  type: 'full',
  start: 0,
  end: 52,
};

class GlobalProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Hello',
      playingClip: fullVideoClip,
      editingClip: null,
      clips: [
        fullVideoClip,
        {
          id: 2,
          name: 'First part',
          type: 'fragment',
          start: 0,
          end: 10,
        },
        {
          id: 3,
          name: 'Second part',
          type: 'fragment',
          start: 22,
          end: 35,
        },
        {
          id: 4,
          name: 'Third part',
          type: 'fragment',
          start: 36,
          end: 52,
        },
      ],
      updateClip: clip => this.updateClip(clip),
      nextClip: () => this.nextClip(),
      previousClip: () => this.previousClip(),
      updateEditingClip: clip => this.updateEditingClip(clip),
      deleteEditingClip: clip => this.deleteEditingClip(clip),
      addClip: clip => this.addClip(clip),
    };
  }

  nextClip() {
    const { clips, playingClip } = this.state;
    const nextClipPosition = findIndex(clips, clip => playingClip.id === clip.id) + 1;
    const nextClip = clips[nextClipPosition];
    if (!isNull(nextClip) && !isEmpty(nextClip)) {
      this.updateClip(nextClip);
    }
  }

  previousClip() {
    const { clips, playingClip } = this.state;
    const previousClipPosition = findIndex(clips, clip => playingClip.id === clip.id) - 1;
    const nextClip = clips[previousClipPosition];
    if (!isNull(nextClip) && !isEmpty(nextClip)) {
      this.updateClip(nextClip);
    }
  }

  addClip(editingClip) {
    const { clips } = this.state;
    if (editingClip.id === 0) {
      this.addClipQueue(clips, editingClip);
    } else {
      this.updateClipQueue(clips, editingClip);
    }
  }

  updateClipQueue(clips, editingClip) {
    const result = clips.map(obj => [editingClip].find(o => o.id === obj.id) || obj);
    this.setState({ clips: result }, () => {
      this.updateClip(head(clips));
    });
  }

  deleteEditingClip(removingClip) {
    const { clips } = this.state;
    const result = remove(clips, clip => clip.id !== removingClip.id);
    this.setState({ clips: result }, () => {
      this.updateClip(head(result));
    });
  }

  addClipQueue(clips, editingClip) {
    const clip = cloneDeep(editingClip);
    clip.id = size(clips) + 1;
    clip.type = 'fragment';
    clips.push(clip);
    this.setState({ clips }, () => {
      this.updateClip(head(clips));
    });
  }

  updateEditingClip(editingClip) {
    this.setState({ editingClip }, () => {});
  }

  updateClip(playingClip) {
    this.setState({ playingClip }, () => {});
  }

  render() {
    const { children } = this.props;
    const state = {
      state: this.state,
    };
    return (
      <MyContext.Provider value={state}>
        {children}
      </MyContext.Provider>
    );
  }
}

GlobalProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default GlobalProvider;
