import "@expo/metro-runtime"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"
import { Buffer } from 'buffer';
import {TextEncoder} from 'text-encoding';

global.TextEncoder = TextEncoder;
global.Buffer = global.Buffer || Buffer;

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
