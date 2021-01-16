import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import "./GuiasDespacho.css";
import { makeStyles } from "@material-ui/core/styles";
import useGuiasDespachos from "../CustomHooks/useGuiasDespachos";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
function GuiasDespacho() {
  const classes = useStyles();

  const { clientes, cliente, handleChange } = useGuiasDespachos();

  return (
    <div className="guiasdespacho">
      <div className="guiasdespacho__container">
        <div className="guiasdespacho__combobox">
          <div className="guiasdespacho__title">
            <h1>Guias de Despacho</h1>
          </div>
          <div className="guiasdespacho__Select">
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Seleccione un Cliente
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                // value={cliente.infodata?.namecustomer}
                onChange={handleChange}
                label="Seleccione un Cliente"
              >
                <option value="Clientes"></option>
                {clientes.map(({ idcustomer, infodata }) => (
                  <option
                    key={infodata.rutcustomer}
                    value={JSON.stringify({
                      idcustomer: idcustomer,
                      infodata: infodata,
                    })}
                  >
                    {infodata.namecustomer}
                  </option>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GuiasDespacho;
