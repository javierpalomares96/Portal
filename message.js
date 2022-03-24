/*bodytosend = {
    "release_name": "pruebarpctoone3",
    "repochart_name": "bitnami/nginx",
    "values": {
        "useCustomContent": "Yes",
        "websiteData": {
            "index.html": "goodbye!"
        }
    }
}

{"task": "mecpm", //--> indicar que es una acción para MEC platform
        "rabbitmq": {}, //--> dejas la key de rabbitmq vacia, tal cual está aquí
        "command": {"action": "deploy", //#migrate -->acción
                    "namespace": "test",
        },
        "bodytosend":bodytosend} //--> body para enviar al LE*/