import { Box, CircularProgress, Typography } from "@material-ui/core";

export default function CircularProgressWithLabel(props) {
    return (
        <div className="shadowClass progress" style={{ display: "inline-block" }}>
                <div style={{ marginLeft: 40 }} variant="h7" component="h2" color="black" gutterBottom>{props.label}</div>

            <Box  position="relative" display="inline-flex" style={{ margin: 60 }}>
                <CircularProgress variant="determinate" {...props} style={{ color: props.progressColor }} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography

                        variant="caption"
                        component="div"
                        color="textSecondary"
                        style={{ fontSize: 35 }}
                    >{`${props.value} %`}</Typography>
                </Box>

            </Box>
        </div>
    )
}