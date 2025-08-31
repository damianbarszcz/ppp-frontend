import React from "react";

const ManagePlanHeader : React.FC = () => {

    return (
        <section className="m-auto max-w-2xl">
            <header className="text-center">
                <h1 className="font-heading text-3xl font-semibold global--text-white">Ulepsz swój plan</h1>

                <div className="mt-5">
                    <p className="font-body text-base font-medium global--text-d-silver">
                        Rozszerz swój plan aby zyskać nowe możliwości dla swojego konta mentora.
                    </p>
                </div>
            </header>
        </section>
    );
}

export default ManagePlanHeader;
