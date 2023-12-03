import ReservationStation from "./ReservationStation";

class MulDivReservationStation extends ReservationStation {
    clone(): ReservationStation {
        return new MulDivReservationStation(
            this.tag!,
            this.busy,
            this.op!,
            this.vj,
            this.vk,
            this.qj,
            this.qk,
            this.A,
            this.cyclesLeft
        );
    }
}

export default MulDivReservationStation;
