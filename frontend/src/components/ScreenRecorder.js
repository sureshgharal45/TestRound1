import React, { useEffect, useState } from "react";
import RecordRTC from "recordrtc";
import "./ScreenRecoreder.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../actions/userAction";
import { useAlert } from "react-alert";

const ScreenRecorder = () => {
  const [screenStream, setScreenStream] = useState(null);
  const [screenRecorder, setScreenRecorder] = useState(null);
  const [audioVideoStream, setAudioVideoStream] = useState(null);
  const [audioVideoRecorder, setAudioVideoRecorder] = useState(null);
  const [confirmation, setConfirmation] = useState("");
  const [stopRecord, setStopRecord] = useState(true);
  const [screenRecordingBlob, setScreenRecordingBlob] = useState(null);
  const [avRecordingBlob, setAVRecordingBlob] = useState(null);

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const alert = useAlert();
  //start recording
  const startRecording = async () => {
    try {
      //to record screen stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setStopRecord(false);
      setScreenStream(stream);
      const recorder = new RecordRTC(stream, { type: "video" });
      recorder.startRecording();
      setScreenRecorder(recorder);

      //for to record audio and video streams
      const audiovideostreams = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setAudioVideoStream(audiovideostreams);
      const audiovideorecorder = new RecordRTC(audiovideostreams, {
        type: "video",
      });
      audiovideorecorder.startRecording();
      setAudioVideoRecorder(audiovideorecorder);
    } catch (err) {
      console.log(err);
    }
  };

  //stop recording
  const stopRecording = () => {
    if (screenRecorder) {
      screenRecorder.stopRecording(() => {
        const screenblob = screenRecorder.getBlob();
        setScreenRecordingBlob(screenblob);
        saveBlobToLocalStorage("screenRecording", screenblob);
        setScreenRecorder(null);
      });
    }
    setStopRecord(true);

    if (audioVideoRecorder) {
      audioVideoRecorder.stopRecording(() => {
        const audioVideoBlob = audioVideoRecorder.getBlob();
        setAVRecordingBlob(audioVideoBlob);
        saveBlobToLocalStorage("audiovideoRecording", audioVideoBlob);
        setAudioVideoRecorder(null);
      });
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }

    if (audioVideoStream) {
      audioVideoStream.getTracks().forEach((track) => track.stop());
    }
  };

  //saving recording to localstorage
  const saveBlobToLocalStorage = (key, blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      localStorage.setItem(key, base64Data);
    };

    reader.readAsDataURL(blob);
  };

  //getting blobs from localstorage
  const getBlobFromLocalStorage = (key) => {
    const base64Data = localStorage.getItem(key);
    return base64Data ? base64Data : null;
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated && !loading) {
      alert.success("User logged in successfully");
      let confirmationPopUp = window.confirm(
        "Do you want to start recording your screen, audio and webcam"
      );
      setConfirmation(confirmationPopUp);
    }
  }, [isAuthenticated, loading, dispatch, error, alert]);
  return (
    <>
      {isAuthenticated ? (
        <>
          <div className="buttonSets">
            {confirmation &&
              (stopRecord ? (
                <button onClick={startRecording}>Start Recording</button>
              ) : (
                <button onClick={stopRecording}>Stop Recording</button>
              ))}
          </div>
          <div className="recordings">
            {screenRecordingBlob && (
              <div>
                <h2>Screen Recording</h2>
                <video
                  className="video"
                  controls
                  src={window.URL.createObjectURL(screenRecordingBlob)}
                />
              </div>
            )}
            {avRecordingBlob && (
              <div>
                <h2>Audio-Video Recording</h2>
                <video
                  className="video"
                  controls
                  src={window.URL.createObjectURL(avRecordingBlob)}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="noRecordings">
          Recordings will get shown here after logged in
        </div>
      )}
    </>
  );
};

export default ScreenRecorder;
