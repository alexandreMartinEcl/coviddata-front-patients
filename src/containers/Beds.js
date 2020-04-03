import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import Button from "@material-ui/core/Button";
// import { FaPlus, FaEye, FaPencilAlt } from "react-icons/fa";
import { initSchema, cloneSchema, flat } from "../shared/utils/schema";
import ReaTabs from "../components/ReaTabs";
import Form from "../components/Form";
// import { color } from "../shared/utils/sofaScore";
import { global } from "../config";
import { dateToDayStep } from "../shared/utils/date";
import addPatientBasicFormSchema from "../json/schemaPatientBasic.json";
// import AddPatientBasicFormSchema from "../json/schemaPatientBasic.json";

const useStyles = makeStyles(theme => ({
    root: {
    }
}));

function Beds({ dataR, ...props }) {
    const classes = useStyles();
    const [page, setPage] = useState();
    const [openDialRea, setOpenDialRea] = React.useState(false);
    const [openDialPatient, setOpenDialPatient] = React.useState(false);
    const [openDialRemove, setOpenDialRemove] = React.useState(false);
    const [reaToAdd, setReaToAdd] = React.useState();
    const [currentRea, setCurrentRea] = React.useState();
    const [currentUnit, setCurrentUnit] = React.useState();
    const [currentBed, setCurrentBed] = React.useState();
    const [currentPatientName, setCurrentPatientName] = React.useState();

    const { schema, properties } = cloneSchema(addPatientBasicFormSchema);

    const data = {
        reas: [
            {
                name: "Lariboisière - 1",
                units: [
                    {
                        name: "Hégoa",
                        beds: [
                            {
                                index: 1,
                                patient: null,
                                isAvailable: true,
                            },
                            {
                                index: 2,
                                patient: {
                                    id: "1",
                                    nameToDisplay: "e",
                                    age: 21,
                                    state: "grave",
                                    nbDefaillance: 2,
                                    hospitalisationDate: new Date(),
                                    mainDiagnostic: "Covid",
                                },
                                isAvailable: false,
                            }
                        ]
                    },
                    {
                        name: "Sirocco",
                        beds: [
                            {
                                index: 1,
                                patient: null,
                                isAvailable: true,
                            },
                            {
                                index: 2,
                                patient: null,
                                isAvailable: false,
                            }
                        ]
                    }

                ]
            }
        ]
    }

    const handlePatientClick = (idPatient) => {
        if (idPatient) {
            setPage(`/patient/${idPatient}`);
        } else {
            return;
        }
    }

    const tabHasChanged = (idRea) => {
        setCurrentRea(idRea);
    }

    const handleAddReaOpen = () => {
        setOpenDialRea(true);
    }

    const handleAddPatientOpen = (idUnit, idBed) => {
        setCurrentBed(idBed);
        setOpenDialPatient(true);
    }

    const handleRemoveOpen = (idUnit, idBed) => {
        setCurrentBed(idBed);
        const bed = data.reas.filter(rea => rea.name === currentRea)[0]
            .units.filter(unit => unit.name === idUnit)[0]
            .beds.filter(unit => unit.index === idBed)[0];

        setCurrentPatientName(bed.patient.nameToDisplay)
        setOpenDialRemove(true);
    }

    const handleAddReaClose = () => {
        setOpenDialRea(false);
        setReaToAdd("");
    }

    const handleAddPatientClose = () => {
        setCurrentBed(null);
        setOpenDialPatient(false);
    }

    const handleRemoveClose = () => {
        setCurrentBed(null);
        setCurrentPatientName(null)
        setOpenDialRemove(false);
    }

    const onChangeReaToAdd = (event) => {
        setReaToAdd(event.target.value);
    }

    //TODO
    const addRea = () => {

    }

    //TODO
    function onSubmitAddRea() {
        const rea = reaToAdd;
        // const url = config.path.patient + (id ? `${id}/` : "");

        // axios({
        //     method: id ? "put" : "post",
        //     url,
        //     data: formData,
        //     ...config.axios,
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //         "Access-Control-Allow-Origin": "*"
        //     }
        // })
        //     .then(res => {
        //         console.log(res);
        //         setPage(`/patient`);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         setPage(`/patient`);
        //     });
        handleAddReaClose();
    }

    //TODO
    function onSubmitAddPatient(initialData) {
        // const data = flat(initialData);
        // const formData = new FormData();

        // for (let [key, value] of Object.entries(data)) {
        //     formData.append(key, value);
        // }

        // const url = config.path.patient + (id ? `${id}/` : "");

        // axios({
        //     method: id ? "put" : "post",
        //     url,
        //     data: formData,
        //     ...config.axios,
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //         "Access-Control-Allow-Origin": "*"
        //     }
        // })
        //     .then(res => {
        //         console.log(res);
        //         setPage(`/patient`);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         setPage(`/patient`);
        //     });

        // setPage(`/patient/${idPatient}`)
        handleAddPatientClose();
    }

    //TODO
    function onSubmitRemovePatient() {
        handleRemoveClose();
    }

    const FormAddPatient = props => (
        <Form
            schema={schema}
            // uiSchema={}
            onSubmit={form => onSubmitAddPatient(form.formData)}
        />
    );


    const bedItemList = (bed, unitName) => {
        const { index, patient, isAvailable } = bed;
        const { id, nameToDisplay, age, status, nbDefaillance, hospitalisationDate, mainDiagnostic } = patient ? patient : {};
        return (
            <ListItem key={bed.index} role={undefined} dense button >
                <ListItemText id={`bedIndex-${index}`} primary={index} />
                {patient
                    ? <div>
                        <ListItemText
                            id={`patientDetails-${index}`}
                            primary={`${nameToDisplay}`}
                            secondary={age} 
                            onClick={() => handlePatientClick(id)}/>
                        <ListItemText
                            id={`otherDetails-${index}`}
                            primary={`Date d'hospitalisation: ${hospitalisationDate} ${dateToDayStep(hospitalisationDate)}`}
                            secondary={mainDiagnostic} 
                            onClick={() => handlePatientClick(id)}/>
                        <ListItemSecondaryAction>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<RemoveIcon />}
                            onClick={() => handleRemoveOpen(unitName, index)}
                            >
                                Retirer le patient
                        </Button>
                        </ListItemSecondaryAction>
                    </div>
                    : <div>
                        <ListItemText
                            id={`patientDetails-${index}`}
                            primary={isAvailable ? "Libre" : "Indisponible"} />
                        <ListItemText
                            id={`otherDetails-${index}`}
                            primary={""} />
                        <ListItemSecondaryAction>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<AddIcon />}
                                onClick={() => handleAddPatientOpen(unitName, index)}
                            >
                                Ajouter un patient
                                </Button>
                        </ListItemSecondaryAction>
                    </div>
                }
            </ListItem>
        );
    }

    return page ? (
        <Redirect push to={page} />
    ) : (
        <div>
            <ReaTabs
                labels={data.reas.map((rea, id) => Object.assign({}, { title: rea.name, index: id }))}
                contents={data.reas.map((rea, id) => {
                    return {
                        id: id,
                        toRender: (
                            <div>
                                {rea.units.map(unit => {
                                    return (
                                        <div>
                                            <div>{unit.name}</div>
                                            <List className={classes.root}>
                                                {unit.beds.map((bed) => bedItemList(bed, unit.name))}
                                            </List>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    }
                })}
                onTabChange={tabHasChanged}
            onAddRea={handleAddReaOpen}>

            </ReaTabs>

        <Dialog open={openDialRea} onClose={handleAddReaClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Ajout d'un service de réanimation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Ajouter une unité de réanimation
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="reaName"
                    label="Identifiant réanimation"
                    type="text"
                    defaultValue=""
                    fullWidth
                    onChange={onChangeReaToAdd}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddReaClose} color="primary">
                    Annuler
            </Button>
                <Button onClick={onSubmitAddRea} color="primary">
                    Ajouter
            </Button>
            </DialogActions>
        </Dialog>

        <Dialog open={openDialPatient} onClose={handleAddPatientClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Formulaire d'ajout de patient</DialogTitle>
            <DialogContent>
                <FormAddPatient />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddPatientClose} color="primary">
                    Annuler
            </Button>
            </DialogActions>
        </Dialog>

        <Dialog open={openDialRemove} onClose={handleRemoveClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Retrait d'un patient</DialogTitle>
            <DialogContent>
                Êtes-vous sûr de vouloir retirer le patient: {currentPatientName} ?
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRemoveClose} color="primary">
                    Annuler
                    </Button>
                <Button onClick={onSubmitRemovePatient} color="primary">
                    Oui
                    </Button>
            </DialogActions>
        </Dialog>
        </div >
    );
}

export default Beds;


        // <Dialog open={open} onClose={handleAddClose} aria-labelledby="form-dialog-title">
        //     <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        //     <DialogContent>
        //         <DialogContentText>
        //             Ajouter votre nouveau patient
        //         </DialogContentText>
        //         <TextField
        //             autoFocus
        //             margin="dense"
        //             id="name"
        //             label="Nom"
        //             type="text"
        //             fullWidth
        //         />
        //         <TextField
        //             margin="dense"
        //             id="firstName"
        //             label="Prénom"
        //             type="text"
        //             fullWidth
        //         />
        //         <TextField
        //             margin="dense"
        //             id="firstName"
        //             label="Date de naissance"
        //             type="date"
        //             fullWidth
        //         />
        //         <DateField
        //             margin="dense"
        //             id="firstName"
        //             label="Date de naissance"
        //             type="date"
        //             fullWidth
        //         />
        //     </DialogContent>
        //     <DialogActions>
        //         <Button onClick={handleClose} color="primary">
        //             Annuler
        //     </Button>
        //         <Button onClick={handleClose} color="primary">
        //             Subscribe
        //     </Button>
        //     </DialogActions>
        // </Dialog>
