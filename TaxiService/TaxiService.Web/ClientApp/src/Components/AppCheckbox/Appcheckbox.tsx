import React from 'react';
import Checkbox from "@material-ui/core/Checkbox";
import { FormControlLabel } from '@material-ui/core';

export interface AppCheckBoxProps {
    id?: string;
    label: string;
    checked: boolean;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export default function AppCheckbox(props: AppCheckBoxProps) {
    return(
        <FormControlLabel
            control={
                <Checkbox
                    style ={{
                        color: "goldenrod",
                    }}
                    checked={props.checked} 
                    onChange={(e) => props.onChange(e)}
                    id={props.id}
                />
            }
            label={props.label}
        />
    )
}