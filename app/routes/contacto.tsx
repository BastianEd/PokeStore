export function meta() {
    return [
        { title: "Contacto - Pokémon Trading Co." },
    ];
}

export default function Contacto() {
    return (
        <section id="contacto" className="section active">
            <div className="container">
                <h2 className="section-title">Contáctanos - ¡Estamos listos para el intercambio!</h2>

                <div className="contact-container">
                    <div className="contact-form">
                        <h3>Envíanos un Mensaje de Intercambio</h3>
                        <form id="contact-form">
                            <div className="form-group">
                                <label htmlFor="contact-nombre">Nombre de Entrenador</label>
                                <input type="text" id="contact-nombre" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="contact-email">Email de la Pokégear</label>
                                <input type="email" id="contact-email" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="contact-mensaje">Mensaje (Pokémon que buscas o dudas)</label>
                                <textarea id="contact-mensaje" rows={5} required></textarea>
                            </div>

                            <button type="button" className="btn-primary full-width">
                                <i className="fas fa-paper-plane"></i> Enviar Pidgey Mensajero
                            </button>
                        </form>
                    </div>

                    <div className="contact-info">
                        <h3>Información del Centro Pokémon</h3>

                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Base de Operaciones</strong>
                                Av. Kanto 1234, Ciudad Azafrán, Región de Kanto
                            </div>
                        </div>

                        <div className="contact-item">
                            <i className="fas fa-phone"></i>
                            <div>
                                <strong>Comunicaciones por Pokégear</strong>
                                +56 2 2345 6789
                            </div>
                        </div>

                        <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <div>
                                <strong>Email Principal</strong>
                                contacto@poketrading.cl
                            </div>
                        </div>

                        <div className="contact-item">
                            <i className="fas fa-clock"></i>
                            <div>
                                <strong>Horarios de Intercambio</strong>
                                Lun - Vie: 8:00 - 20:00<br />
                                Sáb - Dom: 9:00 - 18:00 (Para la Liga)
                            </div>
                        </div>

                        <div className="faq">
                            <h4>Preguntas Frecuentes de Entrenadores</h4>

                            <div className="faq-item">
                                <strong>¿Realizan envíos de Pokémon?</strong>
                                Sí, realizamos envíos seguros a través del Centro Pokémon de toda la Región Metropolitana.
                            </div>

                            <div className="faq-item">
                                <strong>¿Con cuánta anticipación debo realizar mi captura?</strong>
                                Para Pokémon legendarios o raros, recomendamos 48 horas de anticipación.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}