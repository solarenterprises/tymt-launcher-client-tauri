import { Tooltip, Stack, Box } from "@mui/material";
import { ReactElement } from "react";

export interface IPropsTooltipComponent {
  children: ReactElement<any, any>;
  text: string;
  placement:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start";
}

const TooltipComponent = ({ children, text, placement }: IPropsTooltipComponent) => {
  return (
    <Tooltip
      placement={placement}
      title={
        <Stack
          spacing={"10px"}
          sx={{
            marginBottom: `-10px`,
            marginTop: `-10px`,
            backgroundColor: "rgb(49, 53, 53)",
            padding: "6px 8px",
            borderRadius: "32px",
            border: "1px solid rgb(71, 76, 76)",
          }}
        >
          <Box className="fs-14-regular white">{text}</Box>
        </Stack>
      }
      PopperProps={{
        sx: {
          [`& .MuiTooltip-tooltip`]: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipComponent;
