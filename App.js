/*
 * \file    App.js
 * \author  Surya Timsina
 * \date    March/11/2024
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text,ImageBackground  } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  // State variables for sounds and recordings
  const [sound1, setSound1] = useState(null);
  const [sound2, setSound2] = useState(null);
  const [sound3, setSound3] = useState(null);
  const [recording1, setRecording1] = useState(null);
  const [recording2, setRecording2] = useState(null);
  const [recording3, setRecording3] = useState(null);
  const [recordingUri1, setRecordingUri1] = useState(null);
  const [recordingUri2, setRecordingUri2] = useState(null);
  const [recordingUri3, setRecordingUri3] = useState(null);

  useEffect(() => {
    // Loaded pre-defined sound effects 
    loadSound(require('./sounds/sound1.mp3')).then(setSound1);
    loadSound(require('./sounds/sound2.mp3')).then(setSound2);
    loadSound(require('./sounds/sound3.mp3')).then(setSound3);
  }, []);

  // Function to load sound from source asynchronously
  const loadSound = async (source) => {
    const { sound } = await Audio.Sound.createAsync(source, {}, onLoadError);
    return sound;
  };

  // Error handler for loading sound
  const onLoadError = (error) => {
    console.error('Failed to load sound:', error);
  };

  // Function to play a given sound
  const playSound = async (sound) => {
    try {
      if (sound) {
        await sound.setPositionAsync(0); // Reset sound position to start
        await sound.playAsync(); // Play the sound
      }
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  // Function to start recording audio
  const startRecording = async (index) => {
    try {
      const { granted } = await Audio.requestPermissionsAsync(); // Request recording permission
      if (!granted) {
        throw new Error('Recording permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true, // Allow recording on iOS
        playsInSilentModeIOS: true, // Allow playback on iOS
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY // Set recording options
      );
      // Set the recording based on the index
      if (index === 1) {
        setRecording1(recording);
      } else if (index === 2) {
        setRecording2(recording);
      } else if (index === 3) {
        setRecording3(recording);
      }
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Function to stop recording audio
  const stopRecording = async (index) => {
    try {
      let recording;
      let setRecording;
      let setRecordingUri;
      // Determine which recording to stop based on the index
      if (index === 1) {
        recording = recording1;
        setRecording = setRecording1;
        setRecordingUri = setRecordingUri1;
      } else if (index === 2) {
        recording = recording2;
        setRecording = setRecording2;
        setRecordingUri = setRecordingUri2;
      } else if (index === 3) {
        recording = recording3;
        setRecording = setRecording3;
        setRecordingUri = setRecordingUri3;
      }
      if (recording) {
        await recording.stopAndUnloadAsync(); // Stop and unload the recording
        const uri = recording.getURI(); // Get the URI of the recording
        setRecordingUri(uri); // Set the recording URI
        setRecording(null); // Reset the recording state
        console.log(`Recording ${index} stopped and stored at:`, uri);
        
        // Reset the audio session 
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false, // Disallow recording on iOS
          playsInSilentModeIOS: true, // Allow playback on iOS
        });
      }
    } catch (error) {
      console.error(`Failed to stop recording ${index}:`, error);
    }
  };

  // Function to play a recorded audio
  const playRecording = async (uri) => {
    try {
      if (uri) {
        const { sound } = await Audio.Sound.createAsync({ uri }); // Create a sound from the URI
        await sound.setVolumeAsync(1.0); // Set volume 
        await sound.playAsync(); // Play the sound
        console.log('Playing recorded sound from:', uri);
      }
    } catch (error) {
      console.error('Failed to play recording:', error);
    }
  };

  return (
    <ImageBackground source={require('./images/img.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
       
        <Pressable style={styles.button} onPress={() => playSound(sound1)}>
          <Text style={styles.text}>Sound 1</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => playSound(sound2)}>
          <Text style={styles.text}>Sound 2</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => playSound(sound3)}>
          <Text style={styles.text}>Sound 3</Text>
        </Pressable>
  
        <View style={styles.container}>
          <Pressable
            style={styles.button}
            onPress={recording1 ? () => stopRecording(1) : () => startRecording(1)}
          >
            <Text style={styles.text}>{recording1 ? 'Stop Recording 1' : 'Start Recording 1'}</Text>
          </Pressable>
        
          {recordingUri1 && (
            <Pressable style={styles.playBack} onPress={() => playRecording(recordingUri1)}>
              <Text style={styles.text}>Play Recording 1</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.container}>
          <Pressable
            style={styles.button}
            onPress={recording2 ? () => stopRecording(2) : () => startRecording(2)}
          >
            <Text style={styles.text}>{recording2 ? 'Stop Recording 2' : 'Start Recording 2'}</Text>
          </Pressable>
          {recordingUri2 && (
            <Pressable style={styles.playBack} onPress={() => playRecording(recordingUri2)}>
              <Text style={styles.text}>Play Recording 2</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.container}>
          <Pressable
            style={styles.button}
            onPress={recording3 ? () => stopRecording(3) : () => startRecording(3)}
          >
            <Text style={styles.text}>{recording3 ? 'Stop Recording 3' : 'Start Recording 3'}</Text>
          </Pressable>
          {recordingUri3 && (
            <Pressable style={styles.playBack} onPress={() => playRecording(recordingUri3)}>
              <Text style={styles.text}>Play Recording 3</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    backgroundColor: 'transparent', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 2,
    borderColor: 'blue',
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  playBack: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'aqua',
    borderRadius: 5,
    padding: 10,
    marginLeft: 260,
    marginTop: -50,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});