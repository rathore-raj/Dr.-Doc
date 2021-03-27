import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import array from "../../array";

const useStyles = makeStyles({
  root: {
    maxWidth: "280px",
    display: "inline-block",
    padding: "0px 0px",
    cursor: "pointer",
    margin: "0 auto",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontWeight: "1000",
    fontSize: 14,
    textTransform: "uppercase",
    color: "white",
  },
  pos: {
    marginBottom: 12,
  },
  details: {
    lineHeight: "18px",
    fontSize: "14px",
    fontWeight: "100",
    color: "white",
  },
  logo: {
    fill: "white",
    fontSize: "30px",
    marginBottom: "15px",
  },
});

export default function OutlinedCard(props) {
  let history = useHistory();
  const classes = useStyles();

  const onCardClick = (event, props) => {
    history.push({
      pathname: "/manpulation",
      state: { index: array.indexOf(props.data) },
    });
  };

  return (
    <div
      className={classes.root}
      onClick={(event) => onCardClick(event, props)}
    >
      <Card
        className={classes.root}
        variant="outlined"
        style={{ backgroundColor: props.data.Backgroundcolor }}
      >
        <CardContent>
          <span style={{ color: "white" }}>{props.data.Icon}</span>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {props.data.Title}
          </Typography>
          <Typography
            className={classes.details}
            color="textSecondary"
            gutterBottom
          >
            {props.data.Details}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
