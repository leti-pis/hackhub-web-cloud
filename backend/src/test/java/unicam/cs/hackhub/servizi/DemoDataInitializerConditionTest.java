package unicam.cs.hackhub.servizi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import static org.assertj.core.api.Assertions.assertThat;

class DemoDataInitializerConditionTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(DemoDataInitializer.class);

    @Test
    void initializerAssenteSeLaProprietaNonEConfigurata() {
        contextRunner.run(context -> assertThat(context).doesNotHaveBean(DemoDataInitializer.class));
    }

    @Test
    void initializerAssenteSeDisabilitato() {
        contextRunner.withPropertyValues("app.demo-data.enabled=false")
                .run(context -> assertThat(context).doesNotHaveBean(DemoDataInitializer.class));
    }
}
