import { styled } from '@mui/system';
import { Input, inputClasses } from '@mui/base/Input';
import { selectClasses } from '@mui/material/Select';

 export const StyledInput = styled(Input)(
    ({ theme,width }) => `
  
    .${inputClasses.input} {
      width:${width};
      font-size: 0.875rem;
      font-family: IBM Plex Sans, sans-serif;
      font-weight: 400;
      line-height: 1.5;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
      padding: 8px 12px;
      border-radius: 8px;
  
      &:hover {
        background: ${theme.palette.mode === 'dark' ? '' : grey[100]};
        border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
      }
  
      &:focus {
        outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
      }
    }
  `,
  );

//   export const StyledSelect = styled("select")(
//     ({ theme,width }) => `

//     .${selectClasses.select} {
//       width:400px;
//       font-size: 0.875rem;
//       font-family: IBM Plex Sans, sans-serif;
//       font-weight: 400;
//       line-height: 1.5;
//       color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
//       background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
//       border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
//       padding: 8px 12px;
//       border-radius: 8px;
  
//       &:hover {
//         background: ${theme.palette.mode === 'dark' ? '' : grey[100]};
//         border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
//       }
  
//       &:focus {
//         outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
//       }
//     }
//   `,
//   );


  const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    600: '#0072E5',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E7EBF0',
    200: '#E0E3E7',
    300: '#CDD2D7',
    400: '#B2BAC2',
    500: '#A0AAB4',
    600: '#6F7E8C',
    700: '#3E5060',
    800: '#2D3843',
    900: '#1A2027',
  };