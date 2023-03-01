import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textAlign: "center",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[200],
    "&:hover": {
      backgroundColor: theme.palette.grey[300],
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  loginReg: {
    color: "white",
  },
  gridContainer: {
    height: "400px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "300px",
    },
  },
  button: {
    margin: theme.spacing(1),
    color: "inherit",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textField: {
    margin: "10px 0",
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  formPaper: {
    padding: theme.spacing(2),
  },
  itemContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },
  item: {
    width: "30%",
    padding: theme.spacing(2),
    textAlign: "center",
  },
  itemImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  },
  itemTitle: {
    marginTop: theme.spacing(2),
  },
  iconButton: {
    color: "inherit",
  },
  typography: {
    color: "white",
    variant: "h6",
  },
  tableHeader: {
    fontWeight: "bold !important",
  },
  tagCloud: {
    width: "100%",
    height: "200px",
    padding: "16px",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  tag: {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  },
  leftColumn: {
    flex: "1 0 20%",
    marginRight: theme.spacing(1),
  },
  middleColumn: {
    flex: "1 0 50%",
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  rightColumn: {
    flex: "1 0 25%",
  },
  linkRow: {
    cursor: "pointer",
    "&:hover .MuiDataGrid-cell": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  linkCell: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
}));
