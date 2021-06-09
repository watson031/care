const API = {
    USERS: [
        {
            title: 'Return all the users &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/users',
            response: [
                {
                    id: 1,
                    lastName: 'Doe',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonDoe@hotmail.com',
                    password: 'jhon1234',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 1,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: null
                },
                {
                    id: 2,
                    lastName: 'Smith',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonSmmith154@hotmail.com',
                    password: 'jhon145',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 2,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: ' 22/04/2021',
                    poste: null
                },
                {
                    id: 3,
                    lastName: 'Marc',
                    firstName: 'Stein',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'marcStein@hotmail.com',
                    password: 'marcStein123456',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 3,
                    id_sexe: 1,
                    access_code: 142536,
                    last_date_connected: '22/04/2021',
                    poste: null
                },
                {
                    id: 4,
                    lastName: 'admin',
                    firstName: 'super',
                    date_of_birth: '25/04/1995',
                    phone: null,
                    email: 'superAdmin123@hotmail.com',
                    password: 'theSuperAdmin',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 4,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: null,
                    poste: null
                }
            ]
        },
        {
            title: 'Return a user &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/user/id',
            response: [
                {
                    id: 0,
                    lastName: 'Doe',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonDoe@hotmail.com',
                    password: 'jhon1234',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 1,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: null
                }
            ]
        },
        {
            title: 'Delete(deactivate) a user &nbsp;&nbsp; ☑️',
            Method: 'DELETE',
            url: 'https://care-project.herokuapp.com/user/2',
            response: 222
        },
        {
            title: 'Add a user (patient) &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/user/patient',
            request_body: {
                lastName: 'Doe',
                firstName: 'Jhon',
                date_of_birth: '25/04/1995',
                phone: '514-381-7598',
                email: 'jhonDoe@hotmail.com',
                password: 'jhon1234',
                id_sexe: 1,
                access_code: '148596'
            },
            response: 200
        },
        {
            title: 'Add a user (representant) &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/user/representant',
            request_body: {
                lastName: 'Wick',
                firstName: 'Cena',
                date_of_birth: '16/07/1993',
                phone: '514-381-4652',
                email: 'jwick@hotmail.com',
                password: 'jwick123',
                id_sexe: 1,
                poste: 'Secretaire'
            },
            response: 200
        },
        {
            title: 'Update a user (patient) &nbsp;&nbsp; ☑️',
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/user/patient',
            request_body: {
                id: 20,
                lastName: 'Doe',
                firstName: 'Jhon',
                date_of_birth: '25/04/1995',
                phone: '514-381-7598',
                email: 'jhonDoe@hotmail.com',
                id_sexe: 1
            },
            response: true
        },
        {
            title: 'Update a user (representant) &nbsp;&nbsp; ☑️',
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/user/representant',
            request_body: {
                lastName: 'Wick',
                firstName: 'Cena',
                date_of_birth: '16/07/1993',
                phone: '514-381-4652',
                email: 'jwick@hotmail.com',
                password: 'jwick123',
                id_sexe: 1,
                poste: 'Secretaire',
                id_role: 2
            },
            response: true
        },
        {
            title: 'Get a user by email and password &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/user/login',
            request_body: {
                email: 'jhonDoe@hotmail.com',
                password: 'jhon1234'
            },
            response: {
                id: 3,
                lastName: 'Jon',
                firstName: 'Doe',
                date_of_birth: '25/04/1995',
                phone: '514-381-7598',
                email: 'jhonDoe@hotmail.com',
                password: 'jhon1234',
                is_actif: true,
                creation_date_account: '20/04/2021',
                id_role: 1,
                id_sexe: 1,
                poste: null
            }
        },
        {
            title: 'recuperer tous les users d\'un etablishment &nbsp;&nbsp; ❌',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/usersetablishment/id_establishment',
            response: [
                {
                    id: 1,
                    lastName: 'Doe',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonDoe@hotmail.com',
                    password: 'jhon1234',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 1,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: null
                },
                {
                    id: 2,
                    lastName: 'Smith',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonSmmith154@hotmail.com',
                    password: 'jhon145',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 2,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: 'medecin'
                },
                {
                    id: 3,
                    lastName: 'Marc',
                    firstName: 'Stein',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'marcStein@hotmail.com',
                    password: 'marcStein123456',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 3,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: 'infirmier'
                },
                {
                    id: 4,
                    lastName: 'Toto',
                    firstName: 'Titi',
                    date_of_birth: '25/04/1995',
                    phone: null,
                    email: 'toto@hotmail.com',
                    password: 'theSuperAdmin',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 2,
                    id_sexe: 1,
                    access_code: 15684653,
                    last_date_connected: null,
                    poste: 'infirmier'
                }
            ]
        },
        {
            title: 'recuperer tous les representant d\'un etablishment &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/user/representant/id_establishment',
            response: [
                {
                    id: 1,
                    lastName: 'Doe',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonDoe@hotmail.com',
                    password: 'jhon1234',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 1,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: 'medecin chef'
                },
                {
                    id: 2,
                    lastName: 'Smith',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonSmmith154@hotmail.com',
                    password: 'jhon145',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 2,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: 'medecin'
                },
                {
                    id: 3,
                    lastName: 'Marc',
                    firstName: 'Stein',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'marcStein@hotmail.com',
                    password: 'marcStein123456',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 3,
                    id_sexe: 1,
                    access_code: 142536,
                    last_date_connected: '22/04/2021',
                    poste: 'infirmier'
                },
                {
                    id: 4,
                    lastName: 'Toto',
                    firstName: 'Titi',
                    date_of_birth: '25/04/1995',
                    phone: null,
                    email: 'toto@hotmail.com',
                    password: 'theSuperAdmin',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 2,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: null,
                    poste: 'secretaire'
                }
            ]
        },
        {
            title: 'recuperer tous les representantants associes à un patient &nbsp;&nbsp; ❌',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/patient/representants/id_user',
            response: [
                {
                    id: 1,
                    lastName: 'Doe',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonDoe@hotmail.com',
                    password: 'jhon1234',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 1,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: 'infirmier'
                },
                {
                    id: 2,
                    lastName: 'Smith',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonSmmith154@hotmail.com',
                    password: 'jhon145',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 2,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: 'medecin'
                },
                {
                    id: 3,
                    lastName: 'Marc',
                    firstName: 'Stein',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'marcStein@hotmail.com',
                    password: 'marcStein123456',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 3,
                    id_sexe: 1,
                    access_code: 142536,
                    last_date_connected: '22/04/2021',
                    poste: 'infirmier'
                }
            ]
        },
        {
            title: 'recuperer tous les patients dans un etablishment &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/user/patient/id_establishment',
            response: [
                {
                    id: 43,
                    firstName: null,
                    lastName: null,
                    date_of_birth: null,
                    phone: null,
                    email: 'Michael-Jackson@gmail.com',
                    password: null,
                    is_actif: null,
                    creation_date_account: '2021-04-08T04:00:00.000Z',
                    id_role: 3,
                    id_sexe: null,
                    access_code: 123456,
                    last_date_connected: null,
                    poste: null,
                    id_etablishment: 24,
                    id_user: 107
                },
                {
                    id: 47,
                    firstName: null,
                    lastName: null,
                    date_of_birth: null,
                    phone: null,
                    email: 'aaa@gmailcom',
                    password: null,
                    is_actif: null,
                    creation_date_account: '2021-04-13T05:49:57.310Z',
                    id_role: 3,
                    id_sexe: null,
                    access_code: 195875,
                    last_date_connected: null,
                    poste: null,
                    id_etablishment: 24,
                    id_user: 141
                }
            ]
        },
        {
            title: 'Delete(deactivate) a user &nbsp;&nbsp; ☑️',
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/user/desactivate/id',
            response: true
        },
        {
            title: 'Recuperer un user d\'un etablissement &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/user/id_user/id_setablishment',
            response: [
                {
                    id: 1,
                    lastName: 'Doe',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonDoe@hotmail.com',
                    password: 'jhon1234',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 1,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: null
                }
            ]
        },
        {
            title: 'Recuperer tous les patients de suivi actif(s) dans un etablishment &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/user/patients/active-follow-up',
            response: [
                {
                    id: 1,
                    firstName: null,
                    lastName: null,
                    date_of_birth: null,
                    phone: null,
                    email: 'aaa@gmailcom',
                    password: null,
                    is_actif: true,
                    creation_date_account: '2021-04-13T05:49:57.310Z',
                    id_role: 3,
                    id_sexe: null,
                    access_code: 195875,
                    last_date_connected: null,
                    poste: null,
                    id_user: 141,
                    date_started: '2021-04-13T04:00:00.000Z',
                    id_service: 1,
                    treatment_description: 'Prenez un comprime XXYXYY 1X le jour . Changer de pansement 2X chaque jour',
                    description: 'cardiogramme',
                    id_etablishment: 24
                }
            ]
        },
        {
            title: 'Recuperer tous les users selon statut &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/user/active',
            response: [
                {
                    id: 1,
                    lastName: 'Doe',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonDoe@hotmail.com',
                    password: 'jhon1234',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 1,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: null
                },
                {
                    id: 2,
                    lastName: 'Smith',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonSmmith154@hotmail.com',
                    password: 'jhon145',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 2,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: ' 22/04/2021',
                    poste: null
                },
                {
                    id: 3,
                    lastName: 'Marc',
                    firstName: 'Stein',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'marcStein@hotmail.com',
                    password: 'marcStein123456',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 3,
                    id_sexe: 1,
                    access_code: 142536,
                    last_date_connected: '22/04/2021',
                    poste: null
                },
                {
                    id: 4,
                    lastName: 'admin',
                    firstName: 'super',
                    date_of_birth: '25/04/1995',
                    phone: null,
                    email: 'superAdmin123@hotmail.com',
                    password: 'theSuperAdmin',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 4,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: null,
                    poste: null
                }
            ]
        },
        {
            title: 'recuperer tous les users selon categorie &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/user/role/{id_role}',
            response: [
                {
                    id: 1,
                    lastName: 'Doe',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonDoe@hotmail.com',
                    password: 'jhon1234',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 1,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: 'infirmiere'
                },
                {
                    id: 2,
                    lastName: 'Smith',
                    firstName: 'Jhon',
                    date_of_birth: '25/04/1995',
                    phone: '514-381-7598',
                    email: 'jhonSmmith154@hotmail.com',
                    password: 'jhon145',
                    is_actif: true,
                    creation_date_account: '20/04/2021',
                    id_role: 2,
                    id_sexe: 1,
                    access_code: null,
                    last_date_connected: '22/04/2021',
                    poste: 'infirmier'
                }
            ]
        },
        {
            title: 'Add a note to a patient &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/user/add-note/{id_user}',
            request_body: {
                id_user: 5,
                note: 'Fumeur'
            },
            response: true
        }
    ],
    ROLE: [
        {
            title: 'Recuperer le role selon id &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/role/1',
            response: [
                {
                    id: 1,
                    description: 'admin'
                }
            ]
        },
        {
            title: 'Recuperer tous les roles &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/role',
            response: [
                {
                    id: 1,
                    description: 'admin'
                },
                {
                    id: 2,
                    description: 'representant'
                },
                {
                    id: 3,
                    description: 'patient'
                },
                {
                    id: 4,
                    description: 'super admin'
                }
            ]
        }
    ],
    establishment: [
        {
            title: 'Return all the establishement &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/establishement',
            response: [
                {
                    id: 1,
                    name: 'Centaire dentaire Montreal',
                    description: 'Clinique Dentaire',
                    logo_url: 'clinique_dentaire_logo',
                    phone: '514-284-7599',
                    email: 'cliniquemedical@hotmail.com',
                    adress: '1234, rue des BoisBirand'
                },
                {
                    id: 2,
                    name: 'chum',
                    logo_url: 'chum_logo',
                    description: 'Hospital',
                    phone: '514-458-8015',
                    email: 'chuml@hotmail.com',
                    adress: '1589, rue des hopitaux'
                },
                {
                    id: 2,
                    name: 'Mio',
                    logo_url: 'Mio_logo',
                    description: 'Viterinaire',
                    phone: '514-458-8015',
                    email: 'chuml@hotmail.com',
                    adress: '1589, rue des hopitaux'
                }
            ]
        },
        {
            title: 'add an establishement &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/establishement',
            request_body: {
                establishment: {
                    name: 'hopital Juif',
                    logo_url: 'hopital_juif_logo',
                    phone: '514-786-7555',
                    email: 'hopital-juif@hotmail.com',
                    adress: '1434, boulevard Maisonneuve',
                    description: 'Hospital'
                },
                admin: {
                    lastName: 'Ndiaye',
                    firstName: 'biran',
                    email: 'biran.n@gmail.com',
                    password: 'biran123'
                }
            },
            response: true
        },
        {
            title: 'Update an establishement &nbsp;&nbsp; ❌',
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/establishement/3',
            request_body: {
                id: 3,
                name: 'hopital Juif',
                logo_url: 'hopital_juif_logo',
                phone: '514-786-7555',
                email: 'hopital-juif@hotmail.com',
                adress: '4200, rue des passants',
                description: 'Hospital'
            },
            response: true
        },
        {
            title: 'Get an establishement by id &nbsp;&nbsp; ❌',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/establishement/id',
            response: [
                {
                    id: 3,
                    name: 'hopital Juif',
                    logo_url: 'hopital_juif_logo',
                    phone: '514-786-7555',
                    email: 'hopital-juif@hotmail.com',
                    adress: '1434, boulevard Maisonneuve',
                    description: 'Hospital'
                }
            ]
        },
        {
            title: 'Delete an establishement &nbsp;&nbsp; ☑️',
            Method: 'DELETE',
            url: 'https://care-project.herokuapp.com/establishement/1',
            response: true
        },
        {
            title: 'recuperer les etablishments ou un user a des suivis actif ou pas',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/establishement/id_user',
            response: [
                {
                    id: 1,
                    name: 'Centre dentaire Montreal',
                    description: 'Clinique Dentaire',
                    logo_url: 'clinique_dentaire_logo',
                    phone: '514-284-7599',
                    email: 'cliniquemedical@hotmail.com',
                    adress: '1234, rue des BoisBirand'
                },
                {
                    id: 2,
                    name: 'chum',
                    logo_url: 'chum_logo',
                    description: 'Hospital',
                    phone: '514-458-8015',
                    email: 'chuml@hotmail.com',
                    adress: '1589, rue des hopitaux'
                },
                {
                    id: 2,
                    name: 'Mio',
                    logo_url: 'Mio_logo',
                    description: 'Viterinaire',
                    phone: '514-458-8015',
                    email: 'chuml@hotmail.com',
                    adress: '1589, rue des hopitaux'
                }
            ]
        },
        {
            title: 'Recuperer les etablishments d\'un utilisateur avec au moins un suivi actif &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/establishement/id_user',
            response: [
                {
                    id: 5,
                    name: 'chum Montreal',
                    description: 'cardiogramme',
                    logo_url: 'https://care-project.s3.us-east-2.amazonaws.com/img/1617809204062-chum_logo.png',
                    phone: '+1 544 481 8457',
                    email: 'chummontreal@gmail.com',
                    adress: '9999, Rue Saint Denis, Montreal, QC',
                    id_etablishment: 24,
                    id_user: 141,
                    is_actif: true,
                    date_started: '2021-04-13T04:00:00.000Z',
                    id_service: 1,
                    treatment_description: 'Prenez un comprime XXYXYY 1X le jour . Changer de pansement 2X chaque jour'
                }
            ]
        }
    ],
    SERVICE: [
        {
            title: 'Return all  services  &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/establishements',
            response: [
                {
                    id: 1,
                    description: "operation de l'epaule droit",
                    id_etablishment: 2
                },
                {
                    id: 2,
                    description: "retrait d'une dent de sagesse",
                    id_etablishment: 1
                }
            ]
        },
        {
            title: 'Return all the services by establishement',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/service/id_etablishment',
            response: [
                {
                    id: 1,
                    description: 'prothèse dentaire',
                    id_etablishment: 1
                },
                {
                    id: 2,
                    description: "retrait d'une dent de sagesse",
                    id_etablishment: 1
                }
            ]
        },
        {
            title: 'Return service by id',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/service/1',
            response: [
                {
                    id: 1,
                    description: 'prothèse dentaire',
                    id_etablishment: 1
                }
            ]
        },
        {
            title: 'Add a service',
            Method: 'POST',
            url: ' https://care-project.herokuapp.com/service',
            request_body: {
                description: 'Chirugie du coeur',
                id_etablishment: 2
            },
            response: true
        },
        {
            title: 'Update a service',
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/service/1',
            request_body: {
                id: 1,
                description: 'Chirugie du coeur',
                id_etablishment: 2
            },
            response: true
        },
        {
            title: 'Delete a service',
            Method: 'DELETE',
            url: 'https://care-project.herokuapp.com/service/1',
            response: true
        }
    ],
    SUIVI: [
        {
            title: 'Return all the medical follow-up &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/medical-follow-up',
            response: [
                {
                    id: 1,
                    id_user: 1,
                    is_actif: true,
                    date_started: '25/03/2021',
                    id_service: 1
                },
                {
                    id: 2,
                    id_user: 2,
                    is_actif: true,
                    date_started: '28/03/2021',
                    id_service: 2
                }
            ]
        },
        {
            title: 'Return a medical follow-up by id &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/medical-follow-up/id',
            response:
                {
                    id: 1,
                    id_user: 1,
                    is_actif: true,
                    date_started: '25/03/2021',
                    id_service: 1
                }

        },
        {
            title: 'Add a medical follow-up (email and access-code) &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/medical-follow-up/access-code',
            request_body: {
                email: 'new-user@gmail.com',
                accessCode: 142536
            },
            response: true
        },
        {
            title: 'Update a medical follow-up (treatment_description) &nbsp;&nbsp; ☑️',
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/medical-follow-up/treatment_description',
            request_body: {
                id: 5,
                treatment_description: 'Prenez un comprime XXYXYY 1X le jour . Changer de pansement 2X chaque jour'
            },
            response: true
        },
        {
            title: 'Delete a medical follow-up by id &nbsp;&nbsp; ☑️',
            Method: 'DELETE',
            url: 'https://care-project.herokuapp.com/medical-follow-up/id',
            response: true
        },
        {
            title: 'Recuperer tous les suivis associes a un representant &nbsp;&nbsp; ❌',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/representants/suivi/id_representant',
            response: [
                {
                    id: 1,
                    id_user: 1,
                    is_actif: true,
                    date_started: '25/03/2021',
                    id_service: 1
                },
                {
                    id: 2,
                    id_user: 2,
                    is_actif: true,
                    date_started: '28/03/2021',
                    id_service: 2
                },
                {
                    id: 2,
                    id_user: 2,
                    is_actif: false,
                    date_started: '28/03/2019',
                    id_service: 2
                }
            ]
        },
        {
            title: 'recuperer tous les suivis d\'un user dans un etablishment &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/medical-follow-up/id_user/id_etablishment',
            response: [
                {
                    id: 1,
                    id_user: 1,
                    is_actif: true,
                    date_started: '25/03/2021',
                    id_service: 1
                },
                {
                    id: 2,
                    id_user: 2,
                    is_actif: false,
                    date_started: '28/03/2019',
                    id_service: 2
                }
            ]
        },
        {
            title: 'Recuperer tous les messages echangées dans un suivi &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/medical-follow-up/messages/:id_follow-up',
            response: [
                {
                    id: 1,
                    text: 'allo',
                    img_url: 'left_shoulder_surgery.png',
                    video_url: null,
                    date_time: '24-02-2021',
                    id_user_from: 1,
                    id_user_to: 20,
                    id_suivi: 15
                },
                {
                    id: 2,
                    text: 'Bonjour monsieur',
                    img_url: null,
                    video_url: null,
                    date_time: '24-02-2021',
                    id_user_from: 20,
                    id_user_to: 1,
                    id_suivi: 15
                }
            ]
        },
        {
            title: 'Change the status of a follow-up &nbsp;&nbsp; ☑️',
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/medical-follow-up/status',
            request_body: {
                id_follow_up: 1,
                is_actif: false
            }
        },
        {
            title: 'Add a rep to a follow-up &nbsp;&nbsp; ❌',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/medical-follow-up/add-rep',
            request_body: {
                id_user: 1,
                id_suivi: 3
            },
            response: true
        },
        {
            title: 'Return all active medical follow-up related to a rep &nbsp;&nbsp; ❌',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/active-medical-follow-ups/{id_user(rep)}',
            response: [
                {
                    id: 1,
                    id_user: 1,
                    is_actif: true,
                    date_started: '25/03/2021',
                    id_service: 1
                },
                {
                    id: 2,
                    id_user: 2,
                    is_actif: true,
                    date_started: '28/03/2021',
                    id_service: 2
                }
            ]
        },
        {
            title: 'Ajouter un questionnaire a un suivi &nbsp;&nbsp; ❌',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/medical-follow-up/add-questionnaire',
            request_body: {
                id_service: 1
            },
            response: true
        }
    ],
    // TRAITEMENT: [
    //     {
    //         title: 'Return all the treatements',
    //         Method: 'GET',
    //         url: 'https://care-project.herokuapp.com/treatments',
    //         response: [
    //             {
    //                 id: 1,
    //                 id_user: 1,
    //                 is_actif: true,
    //                 date_started: '25/03/2021',
    //                 id_service: 1
    //             },
    //             {
    //                 id: 2,
    //                 id_user: 2,
    //                 is_actif: true,
    //                 date_started: '28/03/2021',
    //                 id_service: 2
    //             }
    //         ]
    //     },
    //     {
    //         title: 'Return a treatement by id',
    //         Method: 'GET',
    //         url: 'https://care-project.herokuapp.com/treatment/id',
    //         response: [
    //             {
    //                 id: 1,
    //                 description: 'Shoulder circles',
    //                 id_service: 1
    //             }
    //         ]
    //     },
    //     {
    //         title: 'Add a treatement',
    //         Method: 'POST',
    //         url: 'https://care-project.herokuapp.com/treatment',
    //         request_body: {
    //             description: 'Doorway shoulder stretch',
    //             id_service: 1
    //         },
    //         response: true
    //     },
    //     {
    //         title: 'Update a treatement',
    //         Method: 'PUT',
    //         url: 'https://care-project.herokuapp.com/treatment',
    //         request_body: {
    //             id: 1,
    //             description: 'Neck Releases',
    //             id_service: 1

    //         },
    //         response: true
    //     },
    //     {
    //         title: 'Delete a treatement',
    //         Method: 'DELETE',
    //         url: 'https://care-project.herokuapp.com/treatment/id',
    //         response: true
    //     },
    //     {
    //         title: ' Recuperer tous les traitements à un suivi ',
    //         Method: 'GET',
    //         url: 'https://care-project.herokuapp.com/treatments/id_suivi',
    //         response: [
    //             {
    //                 id: 1,
    //                 description: 'changer de pansement',
    //                 id_service: 2
    //             },
    //             {
    //                 id: 2,
    //                 description: 'prendre une pillule (tylenol) chaque 6 heures ',
    //                 id_service: 5
    //             }
    //         ]
    //     }

    // ],
    STATS: [
        {
            title: 'Recuperer le nombre total de message echanges dans un etablishment',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/nombre-de-message/id_etablishment',
            response: 156
        },
        {
            title: 'Recuperer le nombre total de message echanges dans toute la plate-forme',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/nombre-de-message',
            response: 845
        },
        {
            title: 'Recupere le nombre de message en moyenne echanges par jour dans un etablishment',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/nombre-de-message-par-jour/id_etablishment',
            response: 125.5
        },
        {
            title: 'Recupere le nombre de message en moyenne echanges par jour dans toute la plate-forme',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/nombre-de-message-par-jour',
            response: 501.87
        },
        {
            title: 'Recuperer le nombre de patient connected par jour lors de la derniere semaine dans un etablishment',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/nombre-de-patients-connected-par-jour/id_etablishment',
            response: [
                {
                    day: 'Lundi',
                    connected: 38
                },
                {
                    day: 'Mardi',
                    connected: 52
                },
                {
                    day: 'Mercredi',
                    connected: 61
                },
                {
                    day: 'Jeudi',
                    connected: 45
                },
                {
                    day: 'Vendredi',
                    connected: 48
                },
                {
                    day: 'Samedi',
                    connected: 38
                },
                {
                    day: 'Dimanche',
                    connected: 38
                }
            ]
        },
        {
            title: 'Recuperer le nombre de patient connected par jour lors de la derniere semaine dans toute la plate-forme',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/nombre-de-patients-connected-par-jour',
            response: [
                {
                    day: 'Lundi',
                    connected: 38
                },
                {
                    day: 'Mardi',
                    connected: 52
                },
                {
                    day: 'Mercredi',
                    connected: 61
                },
                {
                    day: 'Jeudi',
                    connected: 45
                },
                {
                    day: 'Vendredi',
                    connected: 48
                },
                {
                    day: 'Samedi',
                    connected: 38
                },
                {
                    day: 'Dimanche',
                    connected: 38
                }
            ]
        }
    ],
    REPONSES: [
        {
            title: 'Add response(s) to question',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/add-response',
            request_body: {
                response: 'oui',
                id_question: 2
            },
            response: true
        }
        // {
        //     title: "Recuperer tous les reponses d'un user dans un suivi",
        //     Method: "GET",
        //     url: "https://care-project.herokuapp.com/all-responses/{id-follow-up}",
        //     response: {
        //
        //     }
        // }
    ],
    // FREQUENCE: [
    //     {
    //         title: 'Modifier frequence traitement',
    //         Method: 'POST',
    //         url: 'https://care-project.herokuapp.com/frequence/update-treatment',
    //         request_body: {
    //             amplitude_jour: 1,
    //             frequence_par_jour: 3,
    //             id_traitement: 1,
    //             id_suivi_questionnaire: null

    //         },
    //         response: true
    //     },
    //     {
    //         title: 'Modifier frequence suivi questionnaire',
    //         Method: 'POST',
    //         url: 'https://care-project.herokuapp.com/frequence/update-suivi-questionnaire',
    //         request_body: {
    //             amplitude_jour: 2,
    //             frequence_par_jour: 1,
    //             id_traitement: null,
    //             id_suivi_questionnaire: 1

    //         },
    //         response: true
    //     }
    // ],
    QUESTION: [
        {
            title: 'Recuperer la liste des questions de base &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/question/basic/{id_establishment}',
            response: [
                {
                    question: 'Quel est le niveau de votre douleur?'
                },
                {
                    question: 'À quel endroit ressentez-vous la douleur?'
                }
            ]
        },
        {
            title: 'Recuperer la liste des questions dans un suivi &nbsp;&nbsp; ☑️',
            Method: 'GET',
            url: 'https://care-project.herokuapp.com/question',
            response: [
                {
                    question: 'Quel est le niveau de votre douleur?'
                },
                {
                    question: 'À quel endroit ressentez-vous la douleur?'
                }
            ]
        },
        {
            title: 'Ajouter une question (Question de base) &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/question/add-basic',
            request_body:
                {
                    QUESTION: {
                        question: 'Ressentez-vous la douleur?',
                        is_boolean: false,
                        is_multiple_choice: true,
                        is_emoticon: false,
                        is_range: false,
                        is_extra: false,
                        id_establishment: 24
                    },

                    response: ['bras', 'epaule', 'tête']

                },
            response: true
        },
        {
            title: 'Ajouter une question (Question  extra: nouveau suivi) &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/add-question',
            request_body:
                {
                    id_suivi: 4,
                    QUESTIONS_RESPONSE: [
                        {
                            question: {
                                question: ' ou Ressentez-vous la douleur?',
                                is_boolean: false,
                                is_multiple_choice: true,
                                is_emoticon: false,
                                is_range: false,
                                is_extra: true,
                                id_establishment: 24
                            },
                            responses: ['bras', 'epaule', 'tête'],
                            amplitude_jour: 1

                        },
                        {
                            question: {
                                question: 'Quelle est votre temperature?',
                                is_boolean: false,
                                is_multiple_choice: true,
                                is_emoticon: false,
                                is_range: true,
                                is_extra: true,
                                id_establishment: 24
                            },
                            responses: [0, 2],
                            amplitude_jour: 3
                        },
                        {
                            question: {
                                question: 'Ressentez-vous la douleur?',
                                is_boolean: false,
                                is_multiple_choice: true,
                                is_emoticon: false,
                                is_range: false,
                                is_extra: true,
                                id_establishment: 24
                            },
                            responses: ['OUi', 'Non'],
                            amplitude_jour: 2
                        }
                    ],
                    id_basic_questions: [
                        {
                            id_question: 1,
                            amplitude_jour: 1
                        },
                        {
                            id_question: 2,
                            amplitude_jour: 5
                        },
                        {
                            id_question: 3,
                            amplitude_jour: 6
                        }]
                },
            response: true
        },
        {
            title: 'Modifier une question',
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/update-question',
            request_body:
                {
                    QUESTION: {
                        id: 1,
                        question: 'Ressentez-vous de la douleur?',
                        is_boolean: true,
                        is_multiple_choice: null
                    }
                },
            response: true
        },
        {
            title: "Modifier le ou les reponse d'une question",
            Method: 'PUT',
            url: 'https://care-project.herokuapp.com/update-response',
            request_body: [
                {
                    QUESTIONNAIRE_RESPONSES: {
                        id: 1,
                        response: false,
                        id_question: 1
                    }
                },
                {
                    QUESTIONNAIRE_RESPONSES: {
                        id: 2,
                        response: ['jambe', 'epaule'],
                        id_question: 2
                    }
                }

            ],
            response: true
        },
        {
            title: 'Ajouter les reponses d\'un suivi &nbsp;&nbsp; ☑️',
            Method: 'POST',
            url: 'https://care-project.herokuapp.com/question/response',
            response: [
                {
                    id_question_follow_up: 1,
                    date_response: true,
                    id_question_response: 2
                }
            ]
        }
    ]
}
//
