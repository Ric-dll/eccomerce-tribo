import { createTheme } from '@mui/material/styles';

// Definindo as cores base
const PRETO_VACUO = '#000000';
const CINZA_CONTAINER = '#1a1a1a';
const BRANCO_PURO = '#ffffff';
const CINZA_TEXTO = '#b0b0b0';
const CINZA_BORDA = 'rgba(255, 255, 255, 0.5)'; // Borda dos campos

const theme = createTheme({
  palette: {
    mode: 'dark',
    
    primary: {
      main: BRANCO_PURO,
      contrastText: PRETO_VACUO, // Texto para usar EM CIMA de um botão branco
    },
    secondary: {
      main: CINZA_TEXTO,
      contrastText: PRETO_VACUO,
    },
    background: {
      default: PRETO_VACUO,
      paper: CINZA_CONTAINER,
    },
    text: {
      primary: BRANCO_PURO,
      secondary: CINZA_TEXTO,
    },
  },

  typography: {
    fontFamily: ['Montserrat', 'Roboto', 'Arial', 'sans-serif'].join(','),
    
    // 1. REDUZINDO A FONTE BASE (de 16px padrão para 14px)
    fontSize: 14, 

    // 2. REDUZINDO O TÍTULO 'Cadastro de Cliente'
    h4: { 
      fontWeight: 700,
      fontSize: '1.75rem' // Era ~2.1rem, agora está menor
    },
    h6: { 
      fontWeight: 600,
      fontSize: '1.1rem' // Reduzindo o título do AppBar também
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },

  // AJUSTES GLOBAIS DOS COMPONENTES
  components: {
    
    // --- Configuração dos CAMPOS DE TEXTO ---
    MuiTextField: {
      defaultProps: {
        variant: 'outlined', // Mudar para 'outlined' (contorno)
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Deixar BEM arredondado
          borderRadius: '30px', 
          
          // Define a cor da borda padrão
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: CINZA_BORDA,
          },
          // Define a cor da borda ao passar o mouse
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: BRANCO_PURO,
          },
          // Define a cor da borda QUANDO FOCADO (clicado)
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRANCO_PURO,
          },
        },
        input: {
           // Cor do texto 
          color: BRANCO_PURO,
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: CINZA_TEXTO,
          // Cor do label QUANDO FOCADO (clicado)
          '&.Mui-focused': {
            color: BRANCO_PURO,
          },
        },
      },
    },

    // --- Configuração dos BOTÕES (Button) ---
    MuiButton: {
      styleOverrides: {
        root: {
          // Deixar arredondado
          borderRadius: '30px',
        },
        // Estilo específico para o botão de contorno
        outlinedPrimary: {
          borderColor: BRANCO_PURO, // Garante que a borda seja branca
          color: BRANCO_PURO,
          '&:hover': {
            borderColor: BRANCO_PURO,
            backgroundColor: 'rgba(255, 255, 255, 0.1)' // Leve brilho ao passar o mouse
          }
        },
      },
    },

    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: CINZA_CONTAINER, // Deixa a barra cinza como o container
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                // Bordas mais arredondadas para os containers
                borderRadius: '16px', 
            }
        }
    }
  },
});

export default theme;