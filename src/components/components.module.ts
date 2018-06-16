import { NgModule } from '@angular/core';
import { ChatOptionsComponent } from './chat-options/chat-options';
import { NewChatComponent } from './new-chat/new-chat';
@NgModule({
	declarations: [ChatOptionsComponent,
    NewChatComponent],
	imports: [],
	exports: [ChatOptionsComponent,
    NewChatComponent]
})
export class ComponentsModule {}
