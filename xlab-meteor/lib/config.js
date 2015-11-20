modules = [{
    "id": "xlab_module_1",
    "name": "Health and Fitness",
    "thumbnail": "/images/modules/healthandfitness.jpg"
}, {
    "id": "xlab_module_2",
    "name": "Entertainment",
    "thumbnail": "/images/modules/entertainment.jpg"
}, {
    "id": "xlab_module_3",
    "name": "Lights",
    "thumbnail": "/images/modules/lights.jpg"
}, {
    "id": "xlab_module_4",
    "name": "Orchestration Videos",
    "thumbnail": "/images/modules/orchestration.png"
}]


//PROVIDE ABSOLUTE PATHS ACTUAL VIDEO AND METADATA FILES
//CURRENTLY FOR TESTING ON LOCAL MACHINE
adVideos = [{
    "id": "1",
    "videoSource": "/videos/RachaelRay.mp4",
    "metaSource": "/metadata/RachaelRay.json",
    "name": "Rachael Ray",
    "rating": "4",
    "thumbnail": "/images/rachaelRay.jpg"
}, {
    "id": "2",
    "videoSource": "/videos/macys.mp4",
    "metaSource": "/metadata/macys.json",
    "name": "Macy",
    "rating": "5",
    "thumbnail": "/images/macys.jpg"
}]

yogaVideos = [{
    "id": "1",
    "videoSource": "/videos/RachaelRay.mp4",
    "metaSource": "/metadata/RachaelRay.json",
    "name": "Rachael Ray Yoga",
    "rating": "4",
    "thumbnail": "/images/rachaelRay.jpg"
}, {
    "id": "2",
    "videoSource": "/videos/macys.mp4",
    "metaSource": "/metadata/macys.json",
    "name": "Macy Yoga",
    "rating": "5",
    "thumbnail": "/images/macys.jpg"
}]

lightVideos = [{
    //demo reel
    "id": "169660824",
    "videoSource": "https://s3.amazonaws.com/xlab-media/xlab_livingroom_demo.mp4",
    "metaSource": "",
    "name": "Demo Reel",
    "rating": "4",
    "thumbnail": "/images/modules/demo.png"
}]


// id is same as the key, required for UI
orchDefaultVideos = {
    "2089841711": {
        "id": "2089841711",
        "videoSource": "https://s3.amazonaws.com/xlab-media/matrixClip.mp4",
        "metaSource": "",
        "name": "Matrix",
        "rating": "4",
        "thumbnail": "/images/modules/matrix.jpg"
    },
    "169660824": {
        "id": "169660824",
        "videoSource": "https://s3.amazonaws.com/xlab-media/xlab_livingroom_demo.mp4",
        "metaSource": "",
        "name": "Demo",
        "rating": "5",
        "thumbnail": "/images/modules/demo.png"
    }
}

config = {
    "video": {
        "xlab_module_1": {
            "controls": "off",
            "autoplay": "off",
            "onUpdateTimestamp": "updateTimestamp", //method to be called on the server
            "videoEnd": {
                "timestamp": 0
            }, //fields to be changed at the end of the video
            "videos": yogaVideos
        },
        "xlab_module_2": {
            "controls": "on",
            "autoplay": "on",
            "onUpdateTimestamp": "findAds", //method to be called on the server
            "videoEnd": {
                "timestamp": 0,
                "ads": []
            }, //fields to be changed at the end of the video
            "videos": adVideos
        },
        "xlab_module_3": {
            "controls": "on",
            "autoplay": "on",
            "onUpdateTimestamp": "updateTimeAndEvent", //method to be called on the server
            "videoEnd": {
                "timestamp": 0
            }, //fields to be changed at the end of the video
            "videos": lightVideos
        },
        "xlab_module_4": {
            "controls": "on",
            "autoplay": "on",
            "onUpdateTimestamp": "updateTimeAndEvent", //method to be called on the server
            "videoEnd": {
                "timestamp": 0
            }, //fields to be changed at the end of the video
            "videos": {}
        }
    }
}

// ad information => Maps videoId -> ads for various times
// where ads are maintained as key-value pairs, key -> time of ad,
// value -> details for the ad
ads = {
    //id -> 1 corresponds to the rachael video
    "1": {
        "3": {
            "name": "Rachael Ray Yum-o! Oven Lovin¡¯ 3-pc. Nonstick Cookie Pan Set",
            "location": "/fullsize/4.jpg",
            "url": "http://www.kohls.com/product/prd-1674418/rachael-ray-yum-o-oven-lovin-3-pc-nonstick-cookie-pan-set.jsp"
        },
        "5": {
            "name": "Rachael Ray Stainless Steel II 10-piece Cookware Set",
            "location": "/fullsize/1.jpg",
            "url": "http://www.overstock.com/Home-Garden/Rachael-Ray-Stainless-Steel-II-10-piece-Cookware-Set/6195705/product.html?refccid=I7QHOCQA75RY4WCBCM53PAZR3M&searchidx=28"
        },
        "8": {
            "name": "Rachael Ray Bubble & Brown 1-Quart And 1.5-Quart Stoneware Set",
            "location": "/fullsize/2.jpg",
            "url": "http://www.houzz.com/photos/349754/Rachael-Ray-Bubble---Brown-1-Quart-And-1-5-Quart-Stoneware-Set-modern-bakeware-"
        },
        "10": {
            "name": "Rachael Ray 4.25-qt. Casseroval Dish",
            "location": "/fullsize/3.jpg",
            "url": "http://www.kohls.com/product/prd-544259/rachael-ray-425-qt-casseroval-dish.jsp"
        },
        "12": {
            "name": "Rachael Ray 2-Piece Set Tool Set",
            "location": "/fullsize/5.jpg",
            "url": "http://www.houzz.com/photos/9023519/Rachael-Ray-2-Piece-Set-Tool-Set-contemporary-cooking-utensils"
        },
        "19": {
            "name": "Rachael Ray 'Rise' White Stoneware 16-Piece Dinnerware Set",
            "location": "/fullsize/9.jpg",
            "url": "http://www.overstock.com/Home-Garden/Rachael-Ray-Rise-White-Stoneware-16-Piece-Dinnerware-Set/8559969/product.html?refccid=RP55UPMMNW32J6CLHZJMJUX3HA&searchidx=4"
        },
        "27": {
            "name": "Rachael Ray Stoneware Casserround 2.75-quart Covered Baking Dish",
            "location": "/fullsize/13.jpg",
            "url": "http://www.overstock.com/Home-Garden/Rachael-Ray-Stoneware-Casserround-2.75-quart-Covered-Baking-Dish/7469219/product.html?refccid=FU6YNBPQQ7X3M3KGDDMGCMDKAA&searchidx=33"
        },
        "35": {
            "name": " Big Chill Fridge",
            "location": "/fullsize/12.jpg",
            "url": "http://bigchillfridge.com/products-page/refrigerators/original-big-chill-retro-refrigerator/"
        },
        "48": {
            "name": "Rachael Ray Stoneware Yellow 12-oz Bubble and Brown Bakers",
            "location": "/fullsize/8.jpg",
            "url": "http://www.houzz.com/photos/8603464/Rachael-Ray-Stoneware-Yellow-12-oz-Bubble-and-Brown-Bakers--Set-of-2--contemporary-originals-and-limited-editions"
        },
        "58": {
            "name": "Rachael Ray Garbage Bowls 4-quart Garbage Bowl, Red",
            "location": "/fullsize/6.jpg",
            "url": "http://www.houzz.com/photos/8755406/Rachael-Ray-Garbage-Bowls-4-quart-Garbage-Bowl--Red-contemporary-kitchen-trash-cans"
        },
        "101": {
            "name": "Rachael Ray Red Round and Square 14-Ounce Mug",
            "location": "/fullsize/7.jpg",
            "url": "http://www.houzz.com/photos/10810839/Rachael-Ray-Red-Round-and-Square-14-Ounce-Mugs--Set-of-4--contemporary-mugs"
        },
        "226": {
            "name": "Rachael Ray Stoneware Blue 10-oz Bubble and Brown Ramekins",
            "location": "/fullsize/10.jpg",
            "url": "http://www.houzz.com/photos/8603922/Rachael-Ray-Stoneware-Blue-10-oz-Bubble-and-Brown-Ramekins--Set-of-4--contemporary-originals-and-limited-editions"
        },
        "248": {
            "name": "Rachael Ray Tools Yellow 3-piece Spoonula Set",
            "location": "/fullsize/11.jpg",
            "url": "http://www.overstock.com/Home-Garden/Rachael-Ray-Tools-Yellow-3-piece-Spoonula-Set/7468656/product.html?refccid=Q5BIFMC2JIOKQLKN3E6RK3ZLNI&searchidx=29"
        }


    },
    "2": {
        "28": {
            "name": "Kensie Floral and Lace",
            "location": "/fullsize/28.jpg",
            "url": "http://www.lyst.com/clothing/kensie-lace-inset-floral-print-dress-brilliant-red-combo/"
        },
        "35": {
            "name": "Style&co. Metal Double Keeper Belt",
            "location": "/fullsize/22.jpg",
            "url": "http://www1.macys.com/shop/product/style-co-metal-double-keeper-belt?ID=1111849&CategoryID=26846&LinkType=&swatchColor=Yellow#fn=COLOR%3DYellow%26GENDER_AGE%3DWomen%26sp%3D1%26spc%3D3%26kws%3Dbelt%26slotId%3D2"
        },
        "50": {
            "name": "Judith Jack Bracelet Marcasite and Crystal Bangle",
            "location": "/fullsize/23.jpg",
            "url": "http://www1.macys.com/shop/product/judith-jack-bracelet-marcasite-and-crystal-bangle?ID=566407&CategoryID=55285&LinkType=#fn=GENDER%3DFemale%26METAL%3DSterling"
        },
        "56": {
            "name": "Elegant Black Titanium Bracelet",
            "location": "/fullsize/27.jpg",
            "url": "http://www.jewelryshopus.com/bracelets-for-women/4214-elegant-black-titanium-bracelet-for-women.html"
        },
        "59": {
            "name": "Kenneth Cole New York Silver-Tone Geometric Shell Two-Row Necklace",
            "location": "/fullsize/24.jpg",
            "url": "http://www1.macys.com/shop/product/kenneth-cole-new-york-silver-tone-geometric-shell-two-row-necklace?ID=1288679&CategoryID=55285&LinkType=#fn=GENDER%3DFemale%26NECKLACE_STYLE%3DLayered%26PAGEINDEX%3D3%26sp%3D3%26spc%3D309%26kws%3Dnecklace%26slotId%3D297"
        },
        "61": {
            "name": "Charter Club Gold-Tone Imitation Pearl and Crystal Drama Necklace",
            "location": "/fullsize/26.jpg",
            "url": "http://www1.macys.com/shop/product/guess-legari-studded-caged-lace-up-dress-sandals?ID=1239997&CategoryID=17570&LinkType=#fn=COLOR%3DBlack%26sp%3D9%26spc%3D1215%26ruleId%3D67%26slotId%3D875"
        },
        "66": {
            "name": "GUESS Legari Studded Caged Lace Up Dress Sandals",
            "location": "/fullsize/25.jpg",
            "url": "http://www1.macys.com/shop/product/guess-legari-studded-caged-lace-up-dress-sandals?ID=1239997&CategoryID=17570&LinkType=#fn=COLOR%3DBlack%26sp%3D9%26spc%3D1215%26ruleId%3D67%26slotId%3D875"
        },
        "68": {
            "name": "Kensie Horse Sweater",
            "location": "/fullsize/21.jpg",
            "url": "http://www1.macys.com/shop/product/kensie-sweater-long-sleeve-scoop-neck-horse-print?ID=1053536"
        }
    }
}


orch_time_data = {
    "default": {
        "0": [{
            "id": "none",
            "name": "none",
            "type": "abstract_event",
            "layer": "1"
        }]
    },
    //for matrix
    "2089841711": {
        "2": [{
            "id": "kick1",
            "name": "kick",
            "type": "abstract_event",
            "layer": "1"
        }],
        "7": [{
            "id": "transform1",
            "name": "transform",
            "type": "abstract_event",
            "layer": "2"
        }],

        "11": [{
            "id": "shooting1",
            "name": "shooting",
            "type": "abstract_event",
            "layer": "1"
        }],
        "14": [{
            "id": "knife1",
            "name": "knife",
            "type": "abstract_event",
            "layer": "2"

        }],
        "25": [{
            "id": "shooting2",
            "name": "shooting",
            "type": "abstract_event",
            "layer": "1"
        }],
        "37": [{
            "id": "dodging_bullets1",
            "name": "dodging_bullets",
            "type": "abstract_event",
            "layer": "1"
        }],
        "39": [{
            "id": "dodging_bullets2",
            "name": "dodging_bullets",
            "type": "abstract_event",
            "layer": "1"
        }],
        "41": [{
            "id": "dodging_bullets3",
            "name": "dodging_bullets",
            "type": "abstract_event",
            "layer": "2"
        }],
        "43": [{
            "id": "dodging_bullets4",
            "name": "dodging_bullets",
            "type": "abstract_event",
            "layer": "2"
        }]
    },
    // for demo reel
    "169660824": {
        "1": [{
            "id": "rocket1",
            "name": "rocket",
            "type": "abstract_event"
        }],
        "8": [{
            "id": "dragging1",
            "name": "dragging",
            "type": "abstract_event"
        }],
        "15": [{
            "id": "crashing1",
            "name": "crashing",
            "type": "abstract_event"
        }],
        "24": [{
            "id": "shaking1",
            "name": "shaking",
            "type": "abstract_event"
        }],
        "29": [{
            "id": "wrecks1",
            "name": "wrecks",
            "type": "abstract_event"
        }],
        "36": [{
            "id": "life_vessel1",
            "name": "life_vessel",
            "type": "abstract_event"
        }],
        "49": [{
            "id": "fall1",
            "name": "fall",
            "type": "abstract_event"
        }],
        "54": [{
            "id": "drop_in_water1",
            "name": "drop_in_water",
            "type": "abstract_event"
        }],
        "59": [{
            "id": "swim1",
            "name": "swim",
            "type": "abstract_event"
        }],
        "89": [{
            "id": "push1",
            "name": "push",
            "type": "abstract_event"
        }],
        "92": [{
            "id": "swirl1",
            "name": "swirl",
            "type": "abstract_event"
        }],
        "109": [{
            "id": "Sydney1",
            "name": "Sydney",
            "type": "abstract_event"
        }],
        "120": [{
            "id": "floor1",
            "name": "floor",
            "type": "abstract_event"
        }],
        "122": [{
            "id": "floor2",
            "name": "floor",
            "type": "abstract_event"
        }],
        "124": [{
            "id": "shine1",
            "name": "shine",
            "type": "abstract_event"
        }],
        "129": [{
            "id": "blast1",
            "name": "blast",
            "type": "abstract_event"
        }],
        "141": [{
            "id": "firework1",
            "name": "firework",
            "type": "abstract_event"
        }]
    },
    //for rachael
    "1": {
        "3": "",
        "5": "",
        "8": "",
        "10": "",
        "12": "",
        "19": "",
        "27": "",
        "35": "",
        "48": "",
        "58": "",
        "101": "",
        "226": "",
        "248": ""
    },
    // for macy
    "2": {
        "28": "",
        "35": "",
        "50": "",
        "56": "",
        "59": "",
        "61": "",
        "66": "",
        "68": ""
    }
}

orch_dict_data = {

    "transform": {
        "light": {
            "addr": {
                "duration": "4000",
                "pattern": "wave",
                "color": "0,65535,0",
                "direction": "right",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "3000",
                "pattern": "on",
                "color": "0,65535,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "shooting": {
        "light": {
            "addr": {
                "duration": "3000",
                "pattern": "flash",
                "color": "65535,65535,65535",
                "direction": "none",
                "shape": "X"
            },
            "nonAddr": {
                "duration": "3000",
                "pattern": "on",
                "color": "65535,65535,65535"
            }
        },
        "vest": {},
        "couch": {}
    },
    "dodging_bullets": {
        "light": {
            "addr": {
                "duration": "1000",
                "pattern": "flow",
                "color": "65535,32512,0",
                "direction": "left",
                "shape": "A"
            },
            "nonAddr": {
                "duration": "1000",
                "pattern": "on",
                "color": "65535,32512,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "rocket": {
        "light": {
            "addr": {
                "duration": "3000",
                "pattern": "wave",
                "color": "49664,39424,0",
                "direction": "up",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "3000",
                "pattern": "dim",
                "color": "0,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "dragging": {
        "light": {
            "addr": {
                "duration": "1000",
                "pattern": "wave",
                "color": "65535,65535,65535",
                "direction": "left",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "1000",
                "pattern": "dim",
                "color": "0,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "crashing": {
        "light": {
            "addr": {
                "duration": "3000",
                "pattern": "wave",
                "color": "0,0,0",
                "direction": "left",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "3000",
                "pattern": "flash",
                "color": "65535,65535,65535"
            }
        },
        "vest": {},
        "couch": {}
    },
    "shaking": {
        "light": {
            "addr": {
                "duration": "4000",
                "pattern": "flash",
                "color": "0,0,38144",
                "direction": "none",
                "shape": "X"
            },
            "nonAddr": {
                "duration": "4000",
                "pattern": "dim",
                "color": "0,11930,19381"
            }
        },
        "vest": {},
        "couch": {}
    },
    "wrecks": {
        "light": {
            "addr": {
                "duration": "5000",
                "pattern": "flow",
                "color": "0,39936,31232",
                "direction": "up",
                "shape": "A"
            },
            "nonAddr": {
                "duration": "5000",
                "pattern": "dim",
                "color": "0,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "life_vessel": {
        "light": {
            "addr": {
                "duration": "3000",
                "pattern": "wave",
                "color": "0,0,0",
                "direction": "none",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "3000",
                "pattern": "dim",
                "color": "58931,10783,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "fall": {
        "light": {
            "addr": {
                "duration": "4000",
                "pattern": "wave",
                "color": "51968,65535,57600",
                "direction": "down",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "4000",
                "pattern": "dim",
                "color": "0,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "drop_in_water": {
        "light": {
            "addr": {
                "duration": "2000",
                "pattern": "wave",
                "color": "0,0,0",
                "direction": "down",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "2000",
                "pattern": "dim",
                "color": "0,3332,57785"
            }
        },
        "vest": {},
        "couch": {}
    },
    "swim": {
        "light": {
            "addr": {
                "duration": "2000",
                "pattern": "flow",
                "color": "56576,2560,0",
                "direction": "up",
                "shape": "X"
            },
            "nonAddr": {
                "duration": "2000",
                "pattern": "dim",
                "color": "0,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "push": {
        "light": {
            "addr": {
                "duration": "1000",
                "pattern": "wave",
                "color": "0,19200,46848",
                "direction": "right",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "1000",
                "pattern": "dim",
                "color": "0,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "swirl": {
        "light": {
            "addr": {
                "duration": "4000",
                "pattern": "flash",
                "color": "47360,1536,0",
                "direction": "none",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "4000",
                "pattern": "dim",
                "color": "0,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "Sydney": {
        "light": {
            "addr": {
                "duration": "1000",
                "pattern": "wave",
                "color": "0,0,0",
                "direction": "none",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "1000",
                "pattern": "dim",
                "color": "47467,46321,47467"
            }
        },
        "vest": {},
        "couch": {}
    },
    "floor": {
        "light": {
            "addr": {
                "duration": "1000",
                "pattern": "wave",
                "color": "47360,46080,47360",
                "direction": "left",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "1000",
                "pattern": "dim",
                "color": "0,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "shine": {
        "light": {
            "addr": {
                "duration": "4000",
                "pattern": "wave",
                "color": "64512,0,0",
                "direction": "up",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "4000",
                "pattern": "dim",
                "color": "64663,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "blast": {
        "light": {
            "addr": {
                "duration": "1000",
                "pattern": "wave",
                "color": "0,0,0",
                "direction": "none",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "1000",
                "pattern": "dim",
                "color": "64663,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "firework": {
        "light": {
            "addr": {
                "duration": "1000",
                "pattern": "wave",
                "color": "64512,0,0",
                "direction": "up",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "1000",
                "pattern": "dim",
                "color": "64663,0,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "kick": {
        "light": {
            "addr": {
                "duration": "3000",
                "pattern": "flow",
                "color": "65535,32512,0",
                "direction": "top",
                "shape": "X"
            },
            "nonAddr": {
                "duration": "4000",
                "pattern": "dim",
                "color": "65535,32512,0"
            }
        },
        "vest": {},
        "couch": {}
    },
    "knife": {
        "light": {
            "addr": {
                "duration": "1000",
                "pattern": "none",
                "color": "0,0,0",
                "direction": "none",
                "shape": "none"
            },
            "nonAddr": {
                "duration": "1000",
                "pattern": "dim",
                "color": "65535,0,0"
            }
        },
        "vest": {},
        "couch": {}
    }



}
