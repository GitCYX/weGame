import { Global } from "../Global";
declare let require: any;
const i18n = require('LanguageData');
//全世界语言表，对应facebook的接口getLocale
const FaceBookLocalesMap = {
    Afrikaans : 'af_ZA',
    Akan : 'ak_GH',
    Amharic : 'am_ET',
    Arabic : 'ar_AR',
    Assamese : 'as_IN',
    Aymara : 'ay_BO',
    Azerbaijani : 'az_AZ',
    Belarusian : 'be_BY',
    Bulgarian : 'bg_BG',
    Bengali : 'bn_IN',
    Bhojpuri : 'bp_IN',
    Breton : 'br_FR',
    Bosnian : 'bs_BA',
    Catalan : 'ca_ES',
    SoraniKurdish : 'cb_IQ',
    Cherokee : 'ck_US',
    Corsican : 'co_FR',
    Czech : 'cs_CZ',
    Cebuano : 'cx_PH',
    Welsh : 'cy_GB',
    Danish : 'da_DK',
    German : 'de_DE',
    Greek : 'el_GR',
    English_UK : 'en_GB',
    English_Pirate : 'en_PI',
    English_UpsideDown : 'en_UD',
    English_US : 'en_US',
    Esperanto : 'eo_EO',
    Spanish_Spain : 'es_ES',
    Spanish : 'es_LA',
    Spanish_Mexico : 'es_MX',
    Estonian : 'et_EE',
    Basque : 'eu_ES',
    Persian : 'fa_IR',
    Leet_Speak : 'fb_LT',
    Fula : 'ff_NG',
    Finnish : 'fi_FI',
    Faroese : 'fo_FO',
    French_Canada : 'fr_CA',
    French_France : 'fr_FR',
    Frisian : 'fy_NL',
    Irish : 'ga_IE',
    Galician : 'gl_ES',
    Guarani : 'gn_PY',
    Gujarati : 'gu_IN',
    Classical_Greek : 'gx_GR',
    Hausa : 'ha_NG',
    Hebrew : 'he_IL',
    Hindi : 'hi_IN',
    Croatian : 'hr_HR',
    Haitian_Creole : 'ht_HT',
    Hungarian : 'hu_HU',
    Armenian : 'hy_AM',
    Indonesian : 'id_ID',
    Igbo : 'ig_NG',
    Icelandic : 'is_IS',
    Italian : 'it_IT',
    Japanese : 'ja_JP',
    Japanese_Kansai : 'ja_KS',
    Javanese : 'jv_ID',
    Georgian : 'ka_GE',
    Kazakh : 'kk_KZ',
    Khmer : 'km_KH',
    Kannada : 'kn_IN',
    Korean : 'ko_KR',
    Kashmiri : 'ks_IN',
    Kurdish_Kurmanji : 'ku_TR',
    Kyrgyz : 'ky_KG',
    Latin : 'la_VA',
    Ganda : 'lg_UG',
    Limburgish : 'li_NL',
    Lingala : 'ln_CD',
    Lao : 'lo_LA',
    Lithuanian : 'lt_LT',
    Latvian : 'lv_LV',
    Malagasy : 'mg_MG',
    Māori : 'mi_NZ',
    Macedonian : 'mk_MK',
    Malayalam : 'ml_IN',
    Mongolian : 'mn_MN',
    Marathi : 'mr_IN',
    Malay : 'ms_MY',
    Maltese : 'mt_MT',
    Burmese : 'my_MM',
    Norwegian_bokmal : 'nb_NO',
    Northern_Ndebele : 'nd_ZW',
    Nepali : 'ne_NP',
    Dutch_België : 'nl_BE',
    Dutch : 'nl_NL',
    Norwegian_nynorsk : 'nn_NO',
    Southern_Ndebele : 'nr_ZA',
    Northern_Sotho : 'ns_ZA',
    Chewa : 'ny_MW',
    Oriya : 'or_IN',
    Punjabi : 'pa_IN',
    Polish : 'pl_PL',
    Pashto : 'ps_AF',
    Portuguese_Brazil : 'pt_BR',
    Portuguese_Portugal : 'pt_PT',
    Quiché : 'qc_GT',
    Quechua : 'qu_PE',
    Burmese_Zawgyi : 'qz_MM',
    Romansh : 'rm_CH',
    Romanian : 'ro_RO',
    Russian : 'ru_RU',
    Kinyarwanda : 'rw_RW',
    Sanskrit : 'sa_IN',
    Sardinian : 'sc_IT',
    Northern_Sámi : 'se_NO',
    Sinhala : 'si_LK',
    Slovak : 'sk_SK',
    Slovenian : 'sl_SI',
    Shona : 'sn_ZW',
    Somali : 'so_SO',
    Albanian : 'sq_AL',
    Serbian : 'sr_RS',
    Swazi : 'ss_SZ',
    Southern_Sotho : 'st_ZA',
    Swedish : 'sv_SE',
    Swahili : 'sw_KE',
    Syriac : 'sy_SY',
    Silesian : 'sz_PL',
    Tamil : 'ta_IN',
    Telugu : 'te_IN',
    Tajik : 'tg_TJ',
    Thai : 'th_TH',
    Turkmen : 'tk_TM',
    Filipino : 'tl_PH',
    Klingon : 'tl_ST',
    Tswana : 'tn_BW',
    Turkish : 'tr_TR',
    Tsonga : 'ts_ZA',
    Tatar : 'tt_RU',
    Tamazight : 'tz_MA',
    Ukrainian : 'uk_UA',
    Urdu : 'ur_PK',
    Uzbek : 'uz_UZ',
    Venda : 've_ZA',
    Vietnamese : 'vi_VN',
    Wolof : 'wo_SN',
    Xhosa : 'xh_ZA',
    Yiddish : 'yi_DE',
    Yoruba : 'yo_NG',
    Simplified_Chinese_China : 'zh_CN',
    Traditional_Chinese_HongKong : 'zh_HK',
    Traditional_Chinese_Taiwan : 'zh_TW',
    Zulu : 'zu_ZA',
    Zazaki : 'zz_TR',
};

//facebook语言对应本地翻译表的名字
const LanguageTypeMap = {
    zh_CN : 'zh_CN',
}

const {ccclass, property, executionOrder} = cc._decorator;


@ccclass
export default class LanguageMgr extends cc.Component{
    @executionOrder(-9)

    @property
    LanguageDefaultKey = 'en_US';
    
    static instance:LanguageMgr = null;

    onLoad () {
        LanguageMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
    }

    start () {
        var curLanguageKey = this.LanguageDefaultKey;
        /* if(...instance.isFBDefined()){
            curLanguageKey = FBInstantGames.instance.getLocale();

            //考虑到全世界的语言太多，有很多语言没有翻译表的，就使用默认的
            if(this.getLocaleLanguageName(curLanguageKey) === undefined){
                curLanguageKey = this.LanguageDefaultKey;
            }
        }  */
        i18n.init(curLanguageKey);
    }

    getLocaleLanguageName(key){
        return LanguageTypeMap[key];
    }

    getLabel(key){
        key = 'label.' + key;
        let text = i18n.t(key);
        if(text === key){
            Global.WARNING_MSG('language key is not find! key = ' + key);
        }
        return text;
    }
};