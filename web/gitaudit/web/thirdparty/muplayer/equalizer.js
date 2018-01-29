// @license
// Baidu Music Player: 0.9.2
// -------------------------
// (c) 2014 FE Team of Baidu Music
// Can be freely distributed under the BSD license.
(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define('muplayer/lib/AudioContextMonkeyPatch',factory);
  } else {
    factory();
  }
})(this, function () {
  /* Copyright 2013 Chris Wilson

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  */

  /*

  This monkeypatch library is intended to be included in projects that are
  written to the proper AudioContext spec (instead of webkitAudioContext),
  and that use the new naming and proper bits of the Web Audio API (e.g.
  using BufferSourceNode.start() instead of BufferSourceNode.noteOn()), but may
  have to run on systems that only support the deprecated bits.

  This library should be harmless to include if the browser supports
  unprefixed "AudioContext", and/or if it supports the new names.

  The patches this library handles:
  if window.AudioContext is unsupported, it will be aliased to webkitAudioContext().
  if AudioBufferSourceNode.start() is unimplemented, it will be routed to noteOn() or
  noteGrainOn(), depending on parameters.

  The following aliases only take effect if the new names are not already in place:

  AudioBufferSourceNode.stop() is aliased to noteOff()
  AudioContext.createGain() is aliased to createGainNode()
  AudioContext.createDelay() is aliased to createDelayNode()
  AudioContext.createScriptProcessor() is aliased to createJavaScriptNode()
  OscillatorNode.start() is aliased to noteOn()
  OscillatorNode.stop() is aliased to noteOff()
  AudioParam.setTargetAtTime() is aliased to setTargetValueAtTime()

  This library does NOT patch the enumerated type changes, as it is
  recommended in the specification that implementations support both integer
  and string types for AudioPannerNode.panningModel, AudioPannerNode.distanceModel
  BiquadFilterNode.type and OscillatorNode.type.

  */
  function fixSetTarget(param) {
    if (!param)	// if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }

  if (window.hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
    window.AudioContext = webkitAudioContext;

    if (!AudioContext.prototype.hasOwnProperty('createGain'))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;

    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() {
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function(maxDelayTime) {
      var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() {
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when, offset, duration ) {
          if ( offset || duration )
            this.noteGrainOn( when, offset, duration );
          else
            this.noteOn( when );
        }
      }
      if (!node.stop)
        node.stop = node.noteOff;
      fixSetTarget(node.playbackRate);
      return node;
    };

    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() {
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() {
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if (AudioContext.prototype.hasOwnProperty( 'createOscillator' )) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.start)
          node.start = node.noteOn;
        if (!node.stop)
          node.stop = node.noteOff;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }
});

(function(root, factory) {
  if (typeof exports === 'object') {
    return module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    return define('muplayer/plugin/audioNode',['muplayer/lib/AudioContextMonkeyPatch'], factory);
  } else {
    return root._mu.AudioNode = factory();
  }
})(this, function() {
  var AudioNode;
  return AudioNode = (function() {
    function AudioNode(options) {
      var context, input, opts;
      if (!AudioContext) {
        throw new Error('浏览器暂不支持Web Audio API :(');
      }
      this.opts = opts = $.extend({}, this.defaults, options);
      if (!opts.input) {
        throw new Error('input是必填的初始化参数！');
      }
      this.context = context = new AudioContext();
      input = opts.input;
      if (input instanceof Audio) {
        this.input = context.createMediaElementSource(input);
      } else {
        this.input = input;
      }
      this.output = opts.output || context.destination;
    }

    AudioNode.prototype.connect = function() {
      return this.output.connect.apply(this.output, arguments);
    };

    AudioNode.prototype.disconnect = function() {
      return this.output.disconnect(0);
    };

    return AudioNode;

  })();
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(root, factory) {
  if (typeof exports === 'object') {
    return module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    return define('muplayer/plugin/equalizer',['muplayer/plugin/audioNode'], factory);
  } else {
    return root._mu.Equalizer = factory(_mu.AudioNode);
  }
})(this, function(AudioNode) {
  var Equalizer, mathPow;
  mathPow = Math.pow;
  return Equalizer = (function(_super) {
    __extends(Equalizer, _super);

    Equalizer.prototype.defaults = {
      frequencies: [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
      filter: {
        Q: 1.4,
        gain: 0
      },
      effects: {
        reset: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        electronic: [4, 3.5, 1, 0, -2, 2, 0.5, 1, 4, 5],
        classic: [4.5, 3.5, 3, 2.5, -2, -1.5, 0, 2, 3.5, 4],
        jazz: [4, 3, 1, 2, -2, -2, 0, 1.5, 3, 3.5],
        pop: [-2, -1, 0, 2, 4, 4, 2, 0, -1.5, -2],
        voice: [-2, -3.5, -3, 1, 3.5, 3.5, 3, 1.5, 0.5, -2],
        dance: [3.5, 6.5, 5, 0, 2, 3.5, 5, 4, 3.5, 0],
        rock: [5, 4, 3, 1.5, -0.5, -1.5, 0.5, 2.5, 3.5, 4.5]
      }
    };

    function Equalizer(options) {
      var context, filter, filterOpts, filters, filtersMap, frequency, lastFilter, opts, _i, _len, _ref;
      Equalizer.__super__.constructor.call(this, options);
      opts = this.opts;
      context = this.context;
      filters = [];
      filtersMap = {};
      lastFilter = null;
      filterOpts = opts.filter;
      this.preGain = context.createGain();
      _ref = opts.frequencies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        frequency = _ref[_i];
        filter = context.createBiquadFilter();
        filter.type = filter.PEAKING || 'peaking';
        filter.Q.value = filterOpts.Q;
        filter.gain.value = filterOpts.gain;
        filter.frequency.value = frequency;
        filters.push(filter);
        filtersMap[frequency] = filter;
        if (!lastFilter) {
          this.input.connect(this.preGain);
          this.preGain.connect(filter);
        } else {
          lastFilter.connect(filter);
        }
        lastFilter = filter;
      }
      lastFilter.connect(this.output);
      this.filters = filters;
      this.filtersMap = filtersMap;
    }

    Equalizer.prototype.setEffect = function(type, callback) {
      var effect, effects, filter, i, _i, _len, _ref;
      effects = this.opts.effects;
      effect = effects[type] || effects['reset'];
      _ref = this.filters;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        filter = _ref[i];
        filter.gain.value = effect[i];
      }
      return callback && callback(effect);
    };

    Equalizer.prototype.setPreGainValue = function(v) {
      if (!((-12 <= v && v <= 12))) {
        v = 0;
      }
      return this.preGain.gain.value = mathPow(10, v / 12);
    };

    Equalizer.prototype.setFilterValue = function(frequency, v) {
      var filter;
      if (!((-12 <= v && v <= 12))) {
        v = 0;
      }
      filter = this.filtersMap[frequency];
      if (filter) {
        return filter.gain.value = v;
      }
    };

    return Equalizer;

  })(AudioNode);
});

