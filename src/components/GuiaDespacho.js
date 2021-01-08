import React, { useEffect, useState } from "react";
import "./GuiaDespacho.css";
import useOpenModalDespacho from "./../CustomHooks/useOpenModalDespacho";
import { useSelector } from "react-redux";
import { TouchAppOutlined } from "@material-ui/icons";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ModalAddProductGuia from "./ModalAddProductGuia";
import useOpenModalGuia from "../CustomHooks/useOpenModalGuia";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Tooltip } from "@material-ui/core";
function GuiaDespacho() {
  const listofproducts = useSelector(
    (state) => state.products.productstodeliver
  );

  const customerinfo = useSelector((state) => state.customers.customerinfo);
  const [fecha, setFecha] = useState({
    day: "",
    month: "",
    year: "",
  });

  const {
    openAddproduct,
    amount,
    listadoProductos,
    handleCloseModalGuia,
    handleClickEliminar,
    setAmount,
    handleSubmit,
    handleChange,
    handleOpenModalGuia,
  } = useOpenModalGuia();

  const { day, month, year } = fecha;
  useEffect(() => {
    let d = new Date().getDay();
    let m = new Date().getMonth();
    let y = new Date().getFullYear();
    setFecha({
      day: d,
      month: m,
      year: y,
    });
  }, []);
  let sumacion = 0;
  let iva = 0;
  let total = 0;
  for (let i = 0; i < listofproducts?.length; i++) {
    let price = listofproducts[i].dataproduct.producto.price;
    let totaporprice = price * listofproducts[i].dataproduct.cantidadadespachar;
    sumacion = sumacion + totaporprice;

    iva = sumacion * 0.19;

    total = sumacion + iva;
  }

  function printDocument() {
    const input = document.getElementById("divToPrint");
    html2canvas(input, {
      scale: 0.8,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      let width = pdf.internal.pageSize.getWidth();
      let height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0); // asignar valores aqui
      pdf.save(`Numerodeguia-${customerinfo?.idnumeroguia}.pdf`);
    });
  }

  return (
    <div className="guiadespacho">
      <div className="guiadespacho__button">
        <button onClick={printDocument}>Descargar Archivo</button>
      </div>
      <div className="guiadespacho__container" id="divToPrint">
        <div className="guiadespacho__header">
          <div className="guiadespacho__title">
            <h1>Constructora Annta</h1>
            <span>R.U.T: 56565656-k</span>
            <span>DIRECCION: SAN ESTEBAN</span>
          </div>
          <div className="guiadespacho__numeroguia">
            <h3>Guia de Despacho</h3>
            <span>{customerinfo?.idnumeroguia}</span>
          </div>
        </div>
        <div className="guiadespacho__cliente">
          <div className="guiadespacho__infocliente">
            <div className="guiadespacho__detalle">
              <div>
                <span>Señor(es):</span>
              </div>
              <div>
                <span>
                  {customerinfo?.customerinfo.customerinfo.namecustomer}
                </span>
              </div>
            </div>
            <div className="guiadespacho__detalle">
              <div>
                <span>R.U.T:</span>
              </div>
              <div>
                <span>
                  {customerinfo?.customerinfo.customerinfo.rutcustomer}
                </span>
              </div>
            </div>
            <div className="guiadespacho__detalle">
              <div>
                <span>Direccion:</span>
              </div>
              <div>
                <span>{customerinfo?.customerinfo.customerinfo.address}</span>
              </div>
            </div>
            <div className="guiadespacho__detalle">
              <div>
                <span>Ciudad:</span>
              </div>
              <div>
                <span>{customerinfo?.customerinfo.customerinfo.city}</span>
              </div>
            </div>
            <div className="guiadespacho__detalle">
              <div>
                <span>Region:</span>
              </div>
              <div>
                <span>{customerinfo?.customerinfo.customerinfo.province}</span>
              </div>
            </div>
            <div className="guiadespacho__detalle">
              <div>
                <span>Contacto:</span>
              </div>
              <div>
                <span>{customerinfo?.customerinfo.customerinfo.email}</span>
              </div>
            </div>
            <div className="guiadespacho__detalle">
              <div>
                <span>Tipo de traslado:</span>
              </div>
              <div>
                <span>Operacion no constituye venta</span>
              </div>
            </div>
            {/* <span>Dirección: Direccion del cliente</span>
            <span>Ciudad: Ciudad cliente</span>
            <span>Contacto: email, telefono</span>
            <span>Tipo de traslado: Operacion no constituye venta</span> */}
          </div>
          <div className="guiadespacho__infofecha">
            <span>Fecha Emisión: {new Date().toLocaleDateString()}</span>
            <span></span>
          </div>
        </div>
        <div className="guiadespacho__detallesproducto">
          <table className="guiadespacho__table">
            <tr className="guiadespacho__tr">
              <th>Codigo</th>
              <th>Descripción / Nombre producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
            {listofproducts?.map(({ productid, dataproduct }) => (
              <tr className="guiadespacho__tr">
                <td className="guiadespacho__tdicondelete">
                  <Tooltip title="Eliminar producto de la guia">
                    <HighlightOffIcon
                      onClick={(e) =>
                        handleClickEliminar(productid, dataproduct)
                      }
                    />
                  </Tooltip>
                  <strong>{dataproduct.producto.productcode}</strong>
                </td>
                <td>{dataproduct.producto.name}</td>
                <td>{dataproduct.cantidadadespachar}</td>
                <td>$ {dataproduct.producto.price}</td>
                <td>
                  ${" "}
                  {dataproduct.producto.price * dataproduct.cantidadadespachar}
                </td>
              </tr>
            ))}
          </table>
          <div className="guiadespacho__botonmasproductos">
            <Tooltip title="Agregar productos a la guia">
              <AddCircleIcon
                onClick={(e) => handleOpenModalGuia(customerinfo)}
              />
            </Tooltip>
          </div>
        </div>
        <div className="guiadespacho__totaladespachar">
          <div className="guiadespacho__totalcontainer">
            <div className="guiadespacho__opciones">
              <div>
                <span>Monto Neto: </span>
              </div>
              <div>
                <span>$ {sumacion}</span>
              </div>
            </div>
            <div className="guiadespacho__opciones">
              <div>
                <span>I.V.A 19%:</span>
              </div>
              <div>
                <span>$ {iva.toFixed(0)}</span>
              </div>
            </div>
            <div className="guiadespacho__opciones">
              <div>
                <span>Total:</span>
              </div>
              <div>
                <span>$ {total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="guiadespacho__recibido">
          <div className="guiadespacho__recibidocontainer">
            <div className="guiadespacho__recibidopersona">
              <p>Nombre: _______________________________</p>
            </div>
            <div className="guiadespacho__recibidopersona">
              <p>Rut: __________________________________</p>
            </div>
            <div className="guiadespacho__recibidopersona">
              <p>Fecha:__________________________________</p>
            </div>
          </div>
          <div className="guiadespacho__recibidocontainer">
            <div className="guiadespacho__recibidopersona">
              <p>Firma: _____________________________________</p>
            </div>
          </div>
          <div className="guiadespacho__recibidocontainer">
            <div className="guiadespacho__recibidopersona">
              <p className="guiadespacho__ptag">
                El acuse de recibo que se declara en este acto de acuerdo a lo
                dispuesto en la letra b del art. 4º y la letra c del art. 5º de
                la ley 19.983, acredita que la entrega de mercadería(s) o
                servicio(s) presentado(s) ha(n) sido recibidos en total
                conformidad.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="guiadespacho__button">
        <button onClick={printDocument}>Descargar Archivo</button>
      </div>
      <ModalAddProductGuia
        openAddproduct={openAddproduct}
        amount={amount}
        setAmount={setAmount}
        listadoProductos={listadoProductos}
        handleOpenModalGuia={handleOpenModalGuia}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleClickEliminar={handleClickEliminar}
        handleCloseModalGuia={handleCloseModalGuia}
      />
    </div>
  );
}

export default GuiaDespacho;
