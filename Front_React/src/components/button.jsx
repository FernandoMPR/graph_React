export const Button = ({ mostrarDetalles, setMostrarDetalles }) => {
    return(
            <button
              className="bg-white bg-opacity-20 hover:bg-opacity-60 text-gray-600 font-bold rounded-full w-12 h-12 flex items-center justify-center shadow hover:shadow-lg transition duration-300"
              onClick={() => setMostrarDetalles(!mostrarDetalles)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transform rotate-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          );
        };
