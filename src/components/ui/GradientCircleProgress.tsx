import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

function GradientCircularProgress() {
    return (
        <React.Fragment>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e01cd5" />
                        <stop offset="100%" stopColor="#1CB5E0" />
                        {/* <stop offset="0%" stopColor="#fde229" />
                        <stop offset="100%" stopColor="#397d54" /> */}
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress size={"5rem"} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </React.Fragment>
    );
}
export default function CustomizedProgressBars() {
    return (
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <GradientCircularProgress />
        </Stack>
    );
}