import React, { useEffect, useState } from "react";
import "./GuiaDespacho.css";
import useOpenModalDespacho from "./../CustomHooks/useOpenModalDespacho";
import { useSelector } from "react-redux";

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
  console.log(listofproducts);
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

  return (
    <div className="guiadespacho">
      <div className="guiadespacho__container">
        <div className="guiadespacho__header">
          <div className="guiadespacho__title">
            <h1>Constructora Annta</h1>
            <span>rut: 56565656-k</span>
            <span>Dirección: SAN ESTEBAN</span>
          </div>
          <div className="guiadespacho__numeroguia">
            <h3>Guia de Despacho</h3>
            <span>{customerinfo.idnumeroguia}</span>
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
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
            <tr className="guiadespacho__tr">
              <td>0001</td>
              <td>Producto prueba</td>
              <td>10</td>
              <td>$ 1200</td>
              <td>$ 12000</td>
            </tr>
          </table>
        </div>
        <div className="guiadespacho__totaladespachar">
          <div className="guiadespacho__totalcontainer">
            <div className="guiadespacho__opciones">
              <div>
                <span>Monto Neto:</span>
              </div>
              <div>
                <span>$ Monto here!</span>
              </div>
            </div>
            <div className="guiadespacho__opciones">
              <div>
                <span>I.V.A 19%:</span>
              </div>
              <div>
                <span>$ Monto here!</span>
              </div>
            </div>
            <div className="guiadespacho__opciones">
              <div>
                <span>Total:</span>
              </div>
              <div>
                <span>$ Monto here!</span>
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
    </div>
  );
}

export default GuiaDespacho;
