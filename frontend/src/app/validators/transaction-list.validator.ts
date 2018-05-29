import { AbstractControl } from '@angular/forms';

export function ValidateHashes(control: AbstractControl) {
    if (control.value) {
        //Parse the field to see if a valid set of hashes has been supplied.
        let hashes: string[];
        try {
            const csv = parseCSV(control.value);
        }
        catch (e) {
            console.log('Exception thrown validating: ' + control.value)
            console.log(e);


            return { validHashes: true };

        }
    }
    return null;
}

function parseCSV(input: string) {
    const cleanedHashes: string[] = [];
    try {
        // Need CSV splitter here and another helper to verify that hashes are the correct format.
        const hashes = input.split(',');
        for (const hash of hashes) {
            const cleanedHash = hash.replace(/[\W_]+/g, "");
            if (parseHash(cleanedHash)) {
                cleanedHashes.push(cleanedHash);
            }
        }
    } catch {
        console.log('Unknown error parsing CSV hashes.')
    }
    if (cleanedHashes.length === 0) {
        // Throw an error if we didn't parse a single hash.
        throw new ErrorEvent('No valid hashes supplied.');
    }

}

//Function to verify that a given item is a valid transaction hash. 
function parseHash(input: string): boolean {
    const hexRegEx = new RegExp(/0[xX][0-9A-Fa-f]{64}/);
    return hexRegEx.test(input);
}
