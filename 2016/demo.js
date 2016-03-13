
/* 
 * Real Molecules 1kB demo by Oliver Güther 
 * Orig. for JS1k 2016 Let's get eleMental! contest
 *
 * Minified and compressed with UglifyJS and RegPack 4.
 * Code redundancy increased to compress well with RegPack.
 *
 * Generates molecules like alcohol, acid, ether, methane, ethane, ammonia, amines, alkanes, alkanols, water.
 * Subscript in formula looks best in Firefox, okay in Chrome, worst in IE 11, Edge not tested.
 * 
 * Features:
 * - Generates 30 real existing unique molecules
 * - 2.5D Molecule with approx. real atom distances and radius ratio (H < C), angles ~real for most m.
 * - Chemical empirical formula
 * - Molecule name or group name
 * - Symbol for a characteristic property of the molecule (burnable, toxic, fishy smell... ;)
 *
 * Thanks to JS1k organizers/contributors/participants, RegPack and UglifyJS developers!
 *
 */  
  
q = 1,
R = '^10,^20,^30,^330,^130,^3310|^1330,^310,^3+0,^3+10|^13+0,2', // Regex for the following molecules/groups
T = 'water,ammonia,methane,ethane,methyl alcohol,alcohol,formic acid,alkane group,alkanol group,amine group,ether group',


// createMolecule(atom, prevAtom, x, y, inBackground) draw atom, then gen. next atom, recursive
C = function(j, k, l, m, n) {
    // draw background side chain atoms (main chain is gen. 1st, so we fix it here)
    c.globalCompositeOperation = n ? 'destination-over' : 'source-over';

    for (i = 18 - n + (j.t&&9); i--;) {        
		c.fillStyle = 'hsl(' + [j.t%2 ? 0 : 220, (j.t%3 ? 8 : 0) + '0%', (n ? 74 : (!j.t ? 147 : j.t%3 ? 80 : 55) - 60*Math.sin(i/9))  + '%)'];
        c.beginPath();
        c.arc(l, m, i, Math.PI + j.o + (j.t?.8:1.6), Math.PI + j.o + 6.3 - (j.t?.8:1.6), 0);  // not: 11 for PI/2
        c.fill();
    } 
    
	// use argument n instead of i because of recursion we need a local var
    for (n = j.t + !k; E[1] < 2 && n--;) {  // E[1] < 2 : formic acid got an extra O atom and is done after this
        if (n > j.t - 2) { // gen. main chain 1st
		
            t = Math.random()*6%4|0; // generate new atom type, r*6%4 for balancing molecule distribution
			
            t && E[t] && ++t && ++t; // max one O and N in main chain else transform into C
			h[0] && t == 2 && ++t; // reduce N (amines) occ. for balancing	
			!t && !j.t && ++t && ++t && ++t; // transform H2 into HC-..
			h += t = E[p=3] > 3 ? 0 : Math.min(t,3);  // limit to max 4 C atoms and ensure type is valid,  h += t // store main chain, [p=3]; // main chain pos   
			           		
            j.q = q; // save angle for side chains (due to recursive usage)
            q = -q; // invert main chain angle
				 
        } else {
			p = t = 0; // side chain defaults to H atoms
			h.match(/^310/) && ++t && n--; // transform 2nd form of CH3OH into CH2O2 formic acid (double bond for O)			
        }
        
        E[t]++; // save count per atom type
        e = {t: t, o: p ? q*.5 : n ? j.q*2 : j.q*1.3}; // next atom node
		
		C(e, j, l + Math.cos(e.o) * (t && k ? 36 : 18), m + Math.sin(e.o) * (t && k ? 36 : 18), !p && n); // draw next atom with children	   
    }        
}


// printFormulaAndName(ignore, ignore, x, y)
S = function(j, k, l, m, n) {
    s = '';
	
	// determine empirical formula 
    // most redundant form compresses well with RegPack
    t = 3; s += E[t] ? 'C' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';  
    t = 2; s += !E[3] && E[t]  ? 'N' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';
    t = 0; s += E[t] ? 'H' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';   
    t = 2; s += E[3] && E[t] ? 'N' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';    
    t = 1; s += E[t] ? 'O' + (E[t] > 1 ? E[t] > 9 ? String.fromCharCode(8320 + E[t]/10) + String.fromCharCode(8320 + E[t]%10) : String.fromCharCode(8320 + E[t]%10) : '')  : '';   

	// determine the molecule (group) from formula pattern
	for (t = 0;!h.match(R.split(',')[t]) && ++t;); // the following line is normally not part of the loop but saves 1 B if ; is cut
	
	c.font = 'small-caps 20px s';	
	c.fillStyle = '#333'; // optional but looks cleaner
	
	// 'unicode'[t] works with 2 B but not with 4 B Unicode chars!
	// direct alternative without extra '01221432265'[t] saves 1 - 2 B, but RegPack 4.0.1 dont like it and we still have B left, no need for hand-opt. :)
    c.fillText(s + ' ' + T.split(',')[t] + ' ' + '☔,☠,🔥,⚕,🍷,☣,૮'.split(',')['01221432265'[t]], l, m); // manual todo: after RegPack replace ૮ by 🐬
	
	// Debug code for balancing
	//c.font = '12px s'; window.cnt = window.cnt || 0; window.A = window.A || [0,0,0,0,0,0,0,0,0,0,0]; A[t]++; cnt++; for (aa in A) c.fillText(~~(100*(A[aa]/cnt)), aa*28, 400);c.font = 'small-caps 20px s';
	//window.A = window.A || {}; A[h] = 1; c.fillText(Object.keys(A).length, 100, 20); // count molecules
}


// init and render scene 
U = function(j, k, l, m, n) {   
	c.clearRect(0,0,3e3,3e3);

    E = [1,0,0,0]; // E = [q=1,0,0,0] saves 1 B but loses variety 
	h = '';
    C({t: 0, o: q*2.6}, 0, 20, 200, 0);
    S({t: 0, o: q*2.6}, 0, 20, 350, 0);
	
	// Debug code for a distinct molecule
	//if (h.match(/^21330/)) clearInterval(iid);
}
//iid = setInterval(U,0) // scroll to molecule to debug


setInterval(U, 3e3) // slideshow for relaxed viewing, impatient can refresh/F5
U()

