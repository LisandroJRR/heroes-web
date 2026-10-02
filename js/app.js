// ==========================================
// CONFIGURACIÓN DE LA API
// ==========================================

const API_URL = "https://heroes-i1wi.onrender.com/api/v1/heroes";


// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

const formHeroe = document.getElementById("formHeroe");
const tablaHeroes = document.getElementById("tablaHeroes");
const mensaje = document.getElementById("mensaje");


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function mostrarMensaje(texto, tipo = "exito") {

  if (!mensaje) {
    return;
  }

  mensaje.textContent = texto;
  mensaje.style.display = "block";

  if (tipo === "error") {
    mensaje.style.backgroundColor = "#f8d7da";
    mensaje.style.color = "#842029";
  } else {
    mensaje.style.backgroundColor = "#d1e7dd";
    mensaje.style.color = "#0f5132";
  }

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 4000);
}


// ==========================================
// OBTENER TODOS LOS HÉROES
// ==========================================

async function obtenerHeroes() {

  try {

    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("No fue posible obtener los héroes");
    }

    const heroes = await respuesta.json();

    mostrarHeroes(heroes);

  } catch (error) {

    console.error(error);

    mostrarMensaje(
      "Error al consultar los héroes.",
      "error"
    );
  }
}


// ==========================================
// MOSTRAR HÉROES EN LA TABLA
// ==========================================

function mostrarHeroes(heroes) {

  if (!tablaHeroes) {
    return;
  }

  tablaHeroes.innerHTML = "";

  if (heroes.length === 0) {

    tablaHeroes.innerHTML = `
            <tr>
                <td colspan="9">
                    No hay héroes registrados.
                </td>
            </tr>
        `;

    return;
  }

  heroes.forEach(heroe => {

    const fila = document.createElement("tr");

    fila.innerHTML = `
            <td>${heroe.id}</td>
            <td>${heroe.nombre}</td>
            <td>${heroe.apellido}</td>
            <td>${heroe.fechaNacimiento}</td>
            <td>${heroe.estadoNacimiento}</td>
            <td>${heroe.epoca}</td>
            <td>${heroe.movimiento}</td>
            <td>${heroe.descripcion || ""}</td>
            <td>
                <button onclick="prepararEdicion(${heroe.id})">
                    Editar
                </button>

                <button onclick="eliminarHeroe(${heroe.id})">
                    Eliminar
                </button>
            </td>
        `;

    tablaHeroes.appendChild(fila);
  });
}


// ==========================================
// CREAR HÉROE
// ==========================================

async function crearHeroe(event) {

  event.preventDefault();

  const heroe = {

    nombre: document.getElementById("nombre").value,

    apellido: document.getElementById("apellido").value,

    fechaNacimiento:
    document.getElementById("fechaNacimiento").value,

    estadoNacimiento:
    document.getElementById("estadoNacimiento").value,

    epoca:
    document.getElementById("epoca").value,

    movimiento:
    document.getElementById("movimiento").value,

    descripcion:
    document.getElementById("descripcion").value
  };


  try {

    const respuesta = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(heroe)
    });


    const datos = await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        datos.message || "No fue posible registrar el héroe."
      );
    }


    mostrarMensaje(
      "Héroe registrado correctamente."
    );


    formHeroe.reset();

    obtenerHeroes();


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      error.message,
      "error"
    );
  }
}


// ==========================================
// OBTENER HÉROE POR ID
// ==========================================

async function obtenerHeroePorId(id) {

  try {

    const respuesta = await fetch(
      `${API_URL}/${id}`
    );


    const heroe = await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        heroe.message ||
        "No existe el héroe solicitado."
      );
    }


    return heroe;


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      error.message,
      "error"
    );

    return null;
  }
}


// ==========================================
// PREPARAR EDICIÓN
// ==========================================

async function prepararEdicion(id) {

  const heroe = await obtenerHeroePorId(id);

  if (!heroe) {
    return;
  }


  document.getElementById("id").value =
    heroe.id;

  document.getElementById("nombre").value =
    heroe.nombre;

  document.getElementById("apellido").value =
    heroe.apellido;

  document.getElementById("fechaNacimiento").value =
    heroe.fechaNacimiento;

  document.getElementById("estadoNacimiento").value =
    heroe.estadoNacimiento;

  document.getElementById("epoca").value =
    heroe.epoca;

  document.getElementById("movimiento").value =
    heroe.movimiento;

  document.getElementById("descripcion").value =
    heroe.descripcion || "";


  mostrarMensaje(
    "Datos cargados. Puedes modificarlos y guardar."
  );
}


// ==========================================
// ACTUALIZAR HÉROE
// ==========================================

async function actualizarHeroe(id) {

  const heroe = {

    nombre:
    document.getElementById("nombre").value,

    apellido:
    document.getElementById("apellido").value,

    fechaNacimiento:
    document.getElementById("fechaNacimiento").value,

    estadoNacimiento:
    document.getElementById("estadoNacimiento").value,

    epoca:
    document.getElementById("epoca").value,

    movimiento:
    document.getElementById("movimiento").value,

    descripcion:
    document.getElementById("descripcion").value
  };


  try {

    const respuesta = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(heroe)
      }
    );


    const datos = await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        datos.message ||
        "No fue posible actualizar el héroe."
      );
    }


    mostrarMensaje(
      "Héroe actualizado correctamente."
    );


    formHeroe.reset();

    document.getElementById("id").value = "";

    obtenerHeroes();


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      error.message,
      "error"
    );
  }
}


// ==========================================
// ELIMINAR HÉROE
// ==========================================

async function eliminarHeroe(id) {

  const confirmar = confirm(
    "¿Estás seguro de eliminar este héroe?"
  );


  if (!confirmar) {
    return;
  }


  try {

    const respuesta = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );


    if (!respuesta.ok) {

      const datos = await respuesta.json();

      throw new Error(
        datos.message ||
        "No fue posible eliminar el héroe."
      );
    }


    mostrarMensaje(
      "Héroe eliminado correctamente."
    );


    obtenerHeroes();


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      error.message,
      "error"
    );
  }
}


// ==========================================
// BUSCAR POR ÉPOCA
// ==========================================

async function buscarPorEpoca() {

  const valor =
    document.getElementById("buscarEpoca").value.trim();


  if (!valor) {

    mostrarMensaje(
      "Escribe una época para buscar.",
      "error"
    );

    return;
  }


  await buscar(
    `${API_URL}/epoca/${encodeURIComponent(valor)}`
  );
}


// ==========================================
// BUSCAR POR MOVIMIENTO
// ==========================================

async function buscarPorMovimiento() {

  const valor =
    document.getElementById("buscarMovimiento").value.trim();


  if (!valor) {

    mostrarMensaje(
      "Escribe un movimiento para buscar.",
      "error"
    );

    return;
  }


  await buscar(
    `${API_URL}/movimiento/${encodeURIComponent(valor)}`
  );
}


// ==========================================
// BUSCAR POR ESTADO
// ==========================================

async function buscarPorEstado() {

  const valor =
    document.getElementById("buscarEstado").value.trim();


  if (!valor) {

    mostrarMensaje(
      "Escribe un estado para buscar.",
      "error"
    );

    return;
  }


  await buscar(
    `${API_URL}/estado/${encodeURIComponent(valor)}`
  );
}


// ==========================================
// FUNCIÓN GENERAL DE BÚSQUEDA
// ==========================================

async function buscar(url) {

  try {

    const respuesta = await fetch(url);

    const datos = await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        datos.message ||
        "No fue posible realizar la búsqueda."
      );
    }


    mostrarHeroes(datos);


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      error.message,
      "error"
    );
  }
}


// ==========================================
// MOSTRAR TODOS
// ==========================================

function mostrarTodos() {

  obtenerHeroes();

}


// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (formHeroe) {

      formHeroe.addEventListener(
        "submit",
        async function(event) {

          event.preventDefault();


          const id =
            document.getElementById("id").value;


          if (id) {

            await actualizarHeroe(id);

          } else {

            await crearHeroe(event);
          }

        }
      );
    }


    obtenerHeroes();
  }
);
