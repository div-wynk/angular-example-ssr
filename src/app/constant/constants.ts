/**
* Created by Harish Chandra.
*/
export class Constants {
    public static readonly VISIBILITY_CHANGE_EVENT = 'visibilitychange';
    public static readonly GPT_URL = '//www.googletagservices.com/tag/js/gpt.js';
    public static readonly SCRIPT_TYPE = "text/javascript";
    public static GET_HOME_FEATURED_CONTENT = '/v4/featured?contentLangs=';
    public static GET_CONFIG = '/v2/config';
    public static GET_BS = '/health/check';
    public static POST_LOGIN = '/account/v1/login';
    public static PROFILE = "/v2/account/profile";
    public static UPDATE_PLAYLIST = "/v4/user/playlist";
    public static DELETE_PLAYLIST = "/v2/playlists/deleteplaylist";
    public static CLEAR_PLAYLIST_MESSAGE = "The playlist will be deleted";
    public static SEARCH_PACKAGE_DATA = "/v3/search";
    public static UNISEARCH_COUNT = 6;
    public static UNISEARCH_COUNT_FOR_SEARCH = 15;
    public static NON_SEGMENTED_URL = "?sq=m&isWap=1&isSegmented=false";
    public static ONELINK_ID = "3330602766";
    public static SUBDOMAIN = "wynk";
    public static HOMEPAGE_URL = "/music"
    public static APP_LANG = "en";
    public static SQ_TYPE = "curated_artist";
    public static IMG_URL = "https://img.wynk.in/unsafe/320x180/top/";
    public static LOGGER_URL="/log";
    public static FOLLOWED_ARTIST = "/followed/artist";
    public static FOLLOWED_ALL = "/followed/all";
    public static FOLLOWED_PLAYLIST = "/followed/playlist";
    public static UNFOLLOW_URL = "/unfollow ";
    public static FOLLOW_URL= "/follow ";
    public static TV_MAP_URL= "/assets/json/tv-map.json";
    public static LANGUAGE_MAP_URL= "/language-map.json";
    public static PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.bsbportal.music&hl=en_IN";
    public static HELLO_TUNE_PAGE_URL = "https://wynk.in/music/airtel-hellotunes";

    public static ICON_SRC = {

        "dark": {
            "themeIcon" : 'assets/images/dark-mode.svg',
            "languageIcon" : 'assets/images/language-white.svg',
            "profileIcon" : 'assets/images/profile-icon-dark.svg',
            "wynkLogo" : 'assets/images/Wynklogo-white.svg',
            "userProfileIcon" : 'assets/images/dt-userProfile.svg',
            "app-store" : '../../../assets/images/dt-app-store.svg',
            "tv-left": 'assets/images/dt-tv-left-icon.svg',
            "artistsIcon" : 'assets/images/dt-artists.svg',
            "playlistsIcon" : 'assets/images/dt-playlist.svg',
            "bannerIcon" : 'assets/images/dt-bannerDefault.svg',
            "my-music-empty-state" : 'assets/images/dt-my-music-empty-state.svg',
            "no-download-empty-state" : 'assets/images/dt-no-downloaded-empty-state.svg',
            "no-rpl-empty-state" : 'assets/images/dt-no-rpl-empty-state.svg',
            "icon_404" : 'assets/images/dt-404_icon.svg',
            "oopsIcon" : 'assets/images/dt-oops.svg'
        },
        "light": {
            "themeIcon" : 'assets/images/light-icon.svg',
            "languageIcon" : 'assets/images/language.svg',
            "profileIcon" : 'assets/images/profile-icon.svg',
            "wynkLogo" : 'assets/images/Wynklogo.svg',
            "userProfileIcon" : 'assets/images/userProfile.svg',
            "app-store" : 'https://img.wynk.in/unsafe/150x45/filters:no_upscale():format(png):quality(100)/https://s3.ap-south-1.amazonaws.com/assets.wynk.in/images/wap-assets/footer-v2-but-app.png',
            "tv-left" : 'assets/images/TV-left-icon.svg',
            "artistsIcon" : 'assets/images/artistDefaultIcon.svg',
            "playlistsIcon" : 'assets/images/turntableIcon.svg',
            "bannerIcon" : 'assets/images/bannerDefault.svg',
            "my-music-empty-state" : 'assets/images/my-music-empty-state.svg',
            "no-download-empty-state" : 'assets/images/no-downloaded-empty-state.svg',
            "no-rpl-empty-state" : 'assets/images/no-rpl-empty-state.svg',
            "icon_404" : 'assets/images/404_icon.svg',
            "oopsIcon" : 'assets/images/oops.svg'


        }
    }

    public static CONTEXT_LIMIT = {
        'ARTIST_TILE': 15,
        'SIMILAR_ARTIST_TILE': 6,
        'ARTIST_BIO': 180,
        'PACKAGE_TILE': 60,
        'PLAYLIST_TILE': 15,
        'SEARCH_TILE': 60,
        'SIMILAR_PLAYLIST_TILE': 6,
        'SIMILAR_SONG_TILE': 15,
        'RECOMMENDED_PLAYLIST_TILE': 6,
        'MY_PLAYLIST': 36,
        'RECOMMENDED_RAIL_CONTENT':15,
        "LISTING_PAGE_TILE":48
    }

    public static ITEM_TYPES_ARRAY = ['ARTIST', 'ALBUM', 'PLAYLIST', 'PACKAGE'];

    public static HELLO_TUNE_CONFIG = {
        packageId:'srch_bsb_1559202376226',
        showmoreCount:4        
    }

    public static AB_MAPPING = {
        'queueAutoOpen': "vWUd3HfjRlWtLRjcXJ-ZEw"
    }
    public static SCREEN_ID = {
        'BANNER': 'BANNER',
        'detailSearch': 'SearchPage',
        'homescreen': 'Homepage',
        'oldSettingStates': 'ABOUT_US',
        'songInfo': 'SongInfoPage',
        'listInfo': 'ListInfoPage',
        'artistInfo': 'ArtistInfoPage',
        'songLyricsPage': 'SongLyricsPage',
        'payment': 'PAYMENT',
        'about-us': 'ABOUT_US',
        'queue': 'Queue',
        'SEARCH': 'SEARCH',
        'MUSIC_LANGUAGE': 'MUSIC_LANGUAGE',
        'USER_ACCOUNT': 'USER_ACCOUNT',
        'REGISTER': 'REGISTER',
        'VERIFY_PIN': 'VERIFY_PIN',
        'UNABLE_TO_REGISTER': 'UNABLE_TO_REGISTER',
        'LAUNCHER_SCREEN': 'LAUNCHER_SCREEN',
        'EXTERNAL_WEBVIEW': 'EXTERNAL_WEBVIEW',
        'PLAYER': 'PLAYER',
        'LEFT_MENU': 'LEFT_MENU',
        'AddToPlaylist': 'AddToPlaylist',
        "SONG_OVERFLOW": "Song_Overflow",
        "FOOTER": "FOOTER",
        "PLAYBACK": "PLAYBACK",
        "DOWNLOAD_POPUP": "DOWNLOAD_POPUP",
        "MY_MUSIC": 'MyMusicPage',
        "MY_DOWNLOADS": 'DownloadedSongs',
        "MY_PLAYLISTS": 'MyPlaylists',
        "MY_RECENTLY_PLAYED": 'RecentlyPlayed',
        "MY_RECOMMENDED": 'RecommendedSongs',
        "USER_PLAYLIST": 'UserPlaylist',
        "PLAYLIST_INFO_PAGE": 'PlaylistInfoPage',
        "RECOMMENDED_ARTISTS":'RECOMMENDED_ARTISTS',
        'RECOMMENDED_PLAYLISTS':'RECOMMENDED_PLAYLISTS',
        "FOLLOWED_ARTISTS":'FOLLOWED_ARTISTS',
        "FOLLOWED_PLAYLISTS":'FOLLOWED_PLAYLISTS',
        "NOTIFICATION_PLAYER":'NotificationPlayer',
        "AUTOPLAY_QUEUE": "Autoplay_Queue",
        "HELLO_TUNE":"HellotunesPage"
    };

    public static IMAGE_QUALITY = {
        'CAROUSEL': {
            'size': '720x251'
        },
        'SONG-LG': {
            'size': '275x275'
        },
        'SONG-MD': {
            'size': '150x150'
        },
        'SONG-SM': {
            'size': '90x90'
        },
        'SONG-GRID': {
            'size': '180x180'
        },
        'PLAYSTORE': {
            'size': '120x36'
        },
        'SOCIALICONS': {
            'size': '45x45'
        },
        'MEDIA_SESSOION_96x96':{
            'size': '96x96'  
        },
        'MEDIA_SESSOION_256x256':{
            'size': '256x256'  
        },
        'MEDIA_SESSOION_384x384':{
            'size': '384x384'
        },
        'MEDIA_SESSOION_512x512':{
            'size': '512x512'
        }
    };

    public static STATIC_CPMAPPING = {    
        srch_saregama: "sa",
        srch_pplchandigarh: "pc",
        srch_pplmumbai: "pp",
        srch_monstercat: "mt",
        srch_anandamusic: "an",
        srch_abcdigital: "ab",
        adhm_srch_bsb: "ad",
        srch_simca: "si",
        srch_gkdigital: "gk",
        srch_tipsmusic: "tm",
        srch_sonymusic_Sony: "ss",
        srch_rdcmedia: "rm",
        srch_pplkolkata: "pk",
        srch_venus: "ve",
        srch_ingrooves: "ig",
        srch_speedrecords: "sp",
        srch_believe: "bl",
        srch_hungama: "hu",
        srch_unisysinfo: "un",
        srch_timewarner: "tw",
        srch_meshicreations: "mc",
        srch_ppl: "pl",
        srch_shemaroo: "sr",
        srch_sonymusic: "sm",
        srch_bsb: "bb",
        srch_timesmusic: "ti",
        srch_divo: "dv",
        srch_orchard: "or",
        srch_muzik247: "mk",
        srch_erosintl: "ei",
        srch_adityamusic: "am",
        srch_zeemusic: "zm",
        srch_universalmusic: "um"
    }

    public static BUTTONS = {
        "SEE_ALL_RESULTS": "SEE_ALL_RESULTS",
        "SEE_ALL": "SEE_ALL",
        "SEARCH": "SEARCH",
        "NAV_BAR": "NAV_BAR",
        "CONTENT_LANG": "CONTENT_LANG",
        "INSTALL_BANNER": "INSTALL_BANNER",
        "REQUEST_RESEND_OTP": "REQUEST_RESEND_OTP",
        "OTP_ENTERED": "OTP_ENTERED",
        "PLAYER_NEXT": "player_next",
        "PLAYER_PREVIOUS": "player_previous",
        "PLAYER_SHUFFLE": "player_shuffle",
        "PLAYER_TOGGLE": "player_toggle",
        "PLAYER_REPEAT": "player_repeat",
        "NOW_PLAYING": "NOW_PLAYING",
        "PAUSED": "PAUSED",
        "PLAYING": "PLAYING",
        "REPEAT_ONE": "REPEAT_ONE",
        "REPEAT_NONE": "REPEAT_NONE",
        "REPEAT_ALL": "REPEAT_ALL",
        "REPEAT_LIST": "REPEAT_LIST"
    }
    public static DEFAULT_LANGUAGES = ['en', 'hi'];
    public static BANNER_PACKAGE_KEY = 'FEATURED';
    public static WYNK_TOP_100_KEY = 'Wynk Top 100';
    public static LANGUAGE_MAPPING = {
        hi: {
            name: 'हिंदी',
            id: 'hi',
            displayName: "Hindi"
        },
        en: {
            name: 'English',
            id: 'en',
            displayName: "English"
        },
        pa: {
            name: 'ਪੰਜਾਬੀ',
            id: 'pa',
            displayName: "Punjabi"
        },
        gu: {
            name: 'ગુજરાતી',
            id: 'gu',
            displayName: "Gujarati"
        },
        ta: {
            name: 'தமிழ்',
            id: 'ta',
            displayName: "Tamil"
        },
        te: {
            name: 'తెలుగు',
            id: 'te',
            displayName: "Telugu"
        },
        kn: {
            name: 'ಕನ್ನಡ',
            id: 'kn',
            displayName: "Kannada"
        },
        ml: {
            name: 'മലയാളം',
            id: 'ml',
            displayName: "Malayalam"
        },
        ra: {
            name: 'राजस्थानी',
            id: 'ra',
            displayName: "Rajasthani"
        },
        bj: {
            name: 'भोजपुरी',
            id: 'bj',
            displayName: "Bhojpuri"
        },
        mr: {
            name: 'मराठी',
            id: 'mr',
            displayName: "Marathi"
        },
        ba: {
            name: 'বাংলা',
            id: 'ba',
            displayName: "Bengali"
        },
        ha: {
            name: 'हरयाणवी',
            id: 'ha',
            displayName: "Haryanvi"
        },
        or: {
            name: 'ଓଡ଼ିଆ',
            id: 'or',
            displayName: "Oriya"
        },
        as: {
            name: 'অসমীয়া',
            id: 'as',
            displayName: 'Assamese'
        }
    };

    public static LANGUAGE_MAPPING_BY_id = {
        pa: 'Punjabi',
        gu: 'Gujarati',
        ta: 'Tamil',
        ml: 'Malayalam',
        bj: 'Bhojpuri',
        kn: 'Kannada',
        ba: 'Bengali',
        mr: 'Marathi',
        te: 'Telugu',
        hi: 'Hindi',
        en: 'English',
        as: 'Assamese',
        or: 'Oriya',
        haryanvi: 'Haryanvi',
        ha: 'Haryanvi',
        si: 'Sinhalese',
        ra: 'Rajasthani'
    }
    
    public static LANGUAGE_MAPPING_BY_id_noPackage = {
        sa: 'Sanskrit',
        sanskrit: 'Sanskrit',
        es: 'Spanish'
    }

    public static EVENT_NAME = {
        "CLICK": "click",
        "QUEUE_SIZE": "Queue_Size",
        "SONG_PLAYED": "Song_Played",
        "SONG_PLAYED_LONG": "Song_Played_Long",
        "SONG_COMPLETED": "Song_Completed",
        "SONG_ENDED": "SONG_ENDED",
        "ITEM_QUEUED": "ITEM_QUEUED",
        "SCREEN_OPENED": "Screen_Opened",
        "SCREEN_CLOSED": "Screen_Closed",
        "RAIL_VIEWED": "Rail_Viewed",
        "RAIL_SCROLL": "Rail_Scroll",
        "SIGNIN": "SignIn",
        "SIGNOUT": "SignOut",
        "LANG_CHANGED": "Lang_Changed",
        "ITEM_SEARCH": "Item_Search",
        "ITEM_SEARCH_CONSUMED": "Item_Search_Consumed",
        "TRENDING_SEARCHES_SHOWN": "Trending_Searches_Shown",
        "AUTO_SUGGEST_SHOWN": "Auto_Suggest_Shown",
        "RECENT_SEARCHES_SHOWN": "Recent_Searches_Shown",
        "PLAYLIST_NAME_CHANGED": "Playlist_Name_Changed",
        "APP_STARTED": "APP_STARTED",
        "REQUEST_TIME": "REQUEST_TIME",
        "CLICK_TO_PLAY": "CLICK_TO_PLAY",
        "DEV_STATS": "DEV_STATS"
    }
    public static TOAST_MESSAGE = {
        'NAME_EXIST': 'A playlist name already exists.',
        'SONG_ADDED_TO_PLAYLIST': ' song have been added to playlist - ',
        'LOGGED_IN': 'You have successfully logged In!',
        'FUP_Reached_MESSAGE_FOR_LOGGEDIN': 'You’ve reached your free music limit. Please subscribe to Wynk Premium on your mobile App to continue!',
        'FUP_Reached': 'FUP Limit Reached',
        'FUP_Reached_MESSAGE_FOR_NON_LOGGEDIN': 'You’ve reached your free music limit. Please login to continue!',
        'REMOVED_FROM_QUEUE': ' has been removed from queue',
        'SONG_REMOVED_FROM_QUEUE': 'Selected songs have been removed from queue',
        'QUEUE_CLEARED': 'Queue has been cleared',
        'LOGOUT': 'You have successfully logout!',
        'INVALID_SEARCH': 'Not A Valid Search',
        'IS_ADDED_TO_QUEUE': ' is added to queue',
        'INVALID_CONTENT': 'Content not found',
        'FILL_PLAYLIST_NAME': 'Please enter the playlist name',
        'PLAYLIST_NAME_UPDATED': 'Playlist name changed successfully',
        'ERROR_MESSAGE': 'Something Went Wrong',
        'SONG_REMOVED_FROM_PLAYLIST': ' has been removed from ',
        'URL_COPIED': 'URL Copied',
        'LYRICS_TITLE': "Thanks for helping us improve.",
        'LYRICS_MESSAGE': "We'll look into this and fix the issue soon!",
        'PLAYLIST_SPECIAL_CHAR_ERROR': 'Special characters not allowed in name',
        'PLAYLIST_CHAR_LIMIT_ERROR': 'Max character limit exceeded',
        'MAKE_PLAYLIST_PUBLIC': 'Your playlist has been made public. Start sharing it with your friends and Keep Wynk-ing!',
        'MAKE_PLAYLIST_PRIVATE': 'Your playlist has been made private. Keep Wynk-ing the way you like!',
        'FOLLOW_ARTIST': "You just made <artist> happy :)",
        'UNFOLLOW_ARTIST':"<artist> is sad to see you go :(",
        'FOLLOW_PLAYLIST':"You just made this playlist's creator happy :)",
        'UNFOLLOW_PLAYLIST':"This playlist's creator is sad to see you go :(",
        'NETWORK_ERROR': 'Our musicians need internet. They are waiting for you to come online...',
        'PLAY_NEXT_ON_ERROR': 'Looks like few of our notes got missed somewhere. Trying next song...',
        'PLAY_NEXT': 'will be played after',
        'SHUFFLE': 'Playing songs in a new order now'
    }
    
    public static STRUCTURED_DATA_TYPE = {
        'ARTIST': "MusicGroup",
        'ALBUM': "MusicAlbum",
        'SONG': "MusicRecording",
        'PLAYLIST': "MusicPlaylist",
        'PACKAGE': "MusicPlaylist",
        'HOME': "Organization"
    };
    public static HIGH_PRIORITY_EVENT = ["Screen_Opened", "Song_Played", "Song_Played_Long", "SignIn", "APP_STARTED"];
    public static SONG_PAGE_SHOW_TOP_SONGS_ARTIST_COUNT = 1;
    public static SONG_PAGE_TOP_ARTIST_INITIAL_COUNT = 0;
    public static SONG_PAGE_TOP_ARTIST_COUNT = 15;
    public static WINDOW_INNER_WIDTH_FOR_MOBILE = 768;
    public static PLAY_ALL_SONG_TOTAL = 500;
    public static PLAY_ALL_SONG_OFFSET = 0;

    //1000 means these browsers not support webp
    public static BROWSER_WEBP_SUPPORT = {
        "opera": { "minVersion": "11" },
        "opr": { "minVersion": "12" },
        "ucbrowser": { "minVersion": "11" },
        "ucweb": { "minVersion": "1" },
        "edge": { "minVersion": "18" },
        "chrome": { "minVersion": "9" },
        "safari": { "minVersion": "1000" },
        "firefox": { "minVersion": "65" },
        "msie": { "minVersion": "1000" },
        "trident": { "minVersion": "1000" },
        "samsungbrowser": { "minVersion": "4" },
        "crios": { "minVersion": "29" }
    };

    public static LANGUAGE_CONSTANTS = {
        SIGNIN: 'Login/Sign Up',
        SIGNIN_POPUP_TEXT:'Get a personalised experience, and access all your music'
    }

    public static LANGUGE_PAGES_MAP = {
        "assamese": {
          "name": "অসমীয়া",
          "album_package_id": "srch_bsb_1466758762327",
          "playlist_package_id": "srch_bsb_1538134817768",
          "song_package_id": "srch_bsb_1466152656830"
        },
        "tamil": {
          "name": "தமிழ்",
          "album_package_id": "srch_bsb_1431082480394",
          "playlist_package_id": "srch_bsb_1431083246031",
          "song_package_id": "srch_bsb_1400818523491"
        },
        "hindi": {
          "name": "हिंदी",
          "album_package_id": "srch_bsb_1575553331825",
          "playlist_package_id": "srch_bsb_1402666444551",
          "song_package_id": "srch_bsb_1404393019358"
        },
        "bhojpuri": {
          "name": "भोजपुरी",
          "album_package_id": "srch_bsb_1518681172782",
          "playlist_package_id": "srch_bsb_1518762627467",
          "song_package_id": "srch_bsb_1398681632110"
        },
        "malayalam": {
          "name": "മലയാളം",
          "album_package_id": "srch_bsb_1459925868992",
          "playlist_package_id": "srch_bsb_1531294030560",
          "song_package_id": "srch_bsb_1411114275030"
        },
        "telugu": {
          "name": "తెలుగు",
          "album_package_id": "srch_bsb_1431075966136",
          "playlist_package_id": "srch_bsb_1431084194864",
          "song_package_id": "srch_bsb_1400759431497"
        },
        "kannada": {
          "name": "ಕನ್ನಡ",
          "album_package_id": "srch_bsb_1500626245224",
          "playlist_package_id": "srch_bsb_1519025297979",
          "song_package_id": "srch_bsb_1398236047567"
        },
        "bengali": {
          "name": "বাংলা",
          "album_package_id": "srch_bsb_1478512171154",
          "playlist_package_id": "srch_bsb_1519207510316",
          "song_package_id": "srch_bsb_1400131951526"
        },
        "english": {
          "name": "English",
          "album_package_id": "srch_bsb_1575547589832",
          "playlist_package_id": "srch_bsb_1490263494633",
          "song_package_id": "srch_bsb_1398415604876"
        },
        "punjabi": {
          "name": "पंजाबी",
          "album_package_id": "srch_bsb_1431086288965",
          "playlist_package_id": "srch_bsb_1431089229626",
          "song_package_id": "srch_bsb_1400069634753"
        },
        "marathi": {
          "name": "मराठी",
          "album_package_id": "srch_bsb_1507705079674",
          "playlist_package_id": "srch_bsb_1521628358167",
          "song_package_id": "srch_bsb_1411107876475"
        },
        "gujarati": {
          "name": "ગુજરાતી",
          "album_package_id": "srch_bsb_1475472686395",
          "playlist_package_id": "srch_bsb_1538121820724",
          "song_package_id": "srch_bsb_1411127139794"
        },
        "haryanvi": {
          "name": "हरयाणवी",
          "album_package_id": "srch_bsb_1528889298378",
          "playlist_package_id": "srch_bsb_1548936749673",
          "song_package_id": "srch_bsb_1528881097777"
        },
        "oriya": {
          "name": "ଓଡ଼ିଆ",
          "album_package_id": "srch_bsb_1519716072497",
          "playlist_package_id": "srch_bsb_1524215261829",
          "song_package_id": "srch_bsb_1465813103334"
        },
        "rajasthani": {
          "name": "राजस्थानी",
          "playlist_package_id": "srch_bsb_1538121263218",
          "song_package_id": "srch_bsb_1411369341873"
        },
        "sinhalese": {
          "name":"සිංහල",
          "album_package_id": "srch_bsb_1555312543033",
          "playlist_package_id": "srch_bsb_1557307875587"
        },
        "all_language": {
          "playlist_package_id": "srch_bsb_1402666444551,srch_bsb_1490263494633,srch_bsb_1538134817768,srch_bsb_1431083246031,srch_bsb_1518762627467,srch_bsb_1531294030560,srch_bsb_1431084194864,srch_bsb_1519025297979,srch_bsb_1519207510316,srch_bsb_1431089229626,srch_bsb_1521628358167,srch_bsb_1538121820724,srch_bsb_1548936749673,srch_bsb_1524215261829,srch_bsb_1538121263218,srch_bsb_1557307875587",
          "album_package_id":"srch_bsb_1490260980444,srch_bsb_1490598940233,srch_bsb_1466758762327,srch_bsb_1431082480394,srch_bsb_1518681172782,srch_bsb_1459925868992,srch_bsb_1431075966136,srch_bsb_1500626245224,srch_bsb_1478512171154,srch_bsb_1431086288965,srch_bsb_1507705079674,srch_bsb_1475472686395,srch_bsb_1528889298378,srch_bsb_1519716072497,srch_bsb_1555312543033",
          "song_package_id":"srch_bsb_1404393019358,srch_bsb_1398415604876,srch_bsb_1466152656830,srch_bsb_1400818523491,srch_bsb_1398681632110,srch_bsb_1411114275030,srch_bsb_1400759431497,srch_bsb_1398236047567,srch_bsb_1400131951526,srch_bsb_1400069634753,srch_bsb_1411107876475,srch_bsb_1411127139794,srch_bsb_1528881097777,srch_bsb_1465813103334,srch_bsb_1411369341873"
        }
      };
}
