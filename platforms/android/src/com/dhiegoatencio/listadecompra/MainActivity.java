/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.dhiegoatencio.listadecompra;

import android.os.Bundle;
import org.apache.cordova.*;
import com.startapp.android.publish.*;

import com.startapp.android.publish.Ad;
import com.startapp.android.publish.AdDisplayListener;
import com.startapp.android.publish.AdEventListener;
import com.startapp.android.publish.StartAppAd;
import com.startapp.android.publish.StartAppSDK;
import com.startapp.android.publish.nativead.NativeAdDetails;
import com.startapp.android.publish.nativead.NativeAdPreferences;
import com.startapp.android.publish.nativead.NativeAdPreferences.NativeAdBitmapSize;
import com.startapp.android.publish.nativead.StartAppNativeAd;
import com.startapp.android.publish.splash.SplashConfig;
import com.startapp.android.publish.splash.SplashConfig.Theme;


public class MainActivity extends CordovaActivity
{

  /** StartAppAd object declaration */
  private StartAppAd startAppAd = new StartAppAd(this);
  
  /** StartApp Native Ad declaration */
  private StartAppNativeAd startAppNativeAd = new StartAppNativeAd(this);

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        StartAppSDK.init(this, "104092713", "204487225", false); // ads  user ID , app ID

      /** Create Splash Ad **/
      StartAppAd.showSplash(this, savedInstanceState,
          new SplashConfig()
            .setTheme(Theme.GLOOMY)
            //.setLogo(R.drawable.logo)
            .setAppName("Lista de Compras")
      );


        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl); // ja estava no original


    
    /** 
     * Load Native Ad with the following parameters:
     * 1. Only 1 Ad
     * 2. Download ad image automatically
     * 3. Image size of 150x150px
     */
  /*  startAppNativeAd.loadAd(
        new NativeAdPreferences()
          .setAdsNumber(1)
          .setAutoBitmapDownload(true)
          .setImageSize(NativeAdBitmapSize.SIZE150X150),
        nativeAdListener);
*/
    }

}
