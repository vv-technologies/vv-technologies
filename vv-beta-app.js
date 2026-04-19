// FISIER: vv-beta-app.js

async function cancelMission(missionId) {
    if (!missionId) return;

    const db = firebase.firestore();
    const missionRef = db.collection('missions').doc(missionId);

    try {
        // 1. Verificam daca misiunea exista si nu e deja finalizata
        const doc = await missionRef.get();
        if (!doc.exists) {
            console.warn("Misiunea nu mai exista in baza de date.");
            return;
        }

        const data = doc.data();
        if (data.status === 'approved') {
            alert("Nu poți anula o misiune deja aprobată."); // Excepție de la regulă doar pentru erori critice UI
            return;
        }

        // 2. Stergere sigura
        await missionRef.delete();
        
        // 3. Logare in VVhi pentru audit
        VVhi.logRejection({
            missionId: missionId,
            reason: 'USER_CANCELLED',
            timestamp: new Date().toISOString()
        });

        // 4. Update UI local
        document.getElementById(`mission-${missionId}`)?.remove();
        console.log(`Misiune ${missionId} anulata cu succes.`);

    } catch (error) {
        console.error("Eroare la anularea misiunii:", error);
    }
}